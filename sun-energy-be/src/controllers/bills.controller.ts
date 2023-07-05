import { firebaseConfig } from "../config/db.ts";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import Stripe from "stripe";
import { stripeConfig } from "../config/config.ts";

interface Bill {
  uuid: string;
  consumed: number;
  produced: number;
  rate: number;
  total: number;
  dateBilled: string;
  createdAt: string;
  userid: string;
  addressid: string;
  isPaid: boolean;
}

interface BillPayload {
  consumed: number;
  produced: number;
  rate: number;
  date: string;
  addressid: string;
  userid: string;
}

interface Transaction {
  uuid: string;
  amount: number;
  billid: string;
}

interface PaymentPayload {
  total: number;
  text: string;
  billId: string;
  addressId: string;
}

const db = getFirestore(firebaseConfig);
const stripe = new Stripe(stripeConfig.apiKey, { apiVersion: "2022-11-15" });

export const billsController = {
  generateBillForMonth: async (req, res) => {
    try {
      const reqData: BillPayload = req.body;

      const futuresQ = query(
        collection(db, "futures"),
        where("userId", "==", reqData.userid)
      );

      const snapshotFutures = await getDocs(futuresQ);

      const addressFutures = snapshotFutures.docs
        .filter(
          (doc) =>
            doc.data().addressId == reqData.addressid &&
            doc.data().buyerId.length > 0
        )
        .sort((a, b) => a.data().createdAt.localeCompare(b.data().createdAt))
        .map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

      const panelsQ = query(
        collection(db, "panels"),
        where("userId", "==", reqData.userid)
      );

      const snapshotPanels = await getDocs(panelsQ);

      const addressPanels: any = snapshotPanels.docs
        .filter((doc) => doc.data().addressId == reqData.addressid)
        .map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

      const date = moment(reqData.date, "DD/MM/YYYY");

      //Computing produced data while taking futures sold into account
      let produced = reqData.produced;
      let producedSum = 0;
      let panelsProduced = 0;
      for (const future of addressFutures as any) {
        if (
          future.boughtAt.length > 0 &&
          date.isBetween(
            moment(future.boughtAt, "DD/MM/YYYY"),
            moment(future.maturityDate, "DD/MM/YYYY"),
            "month",
            "(]"
          )
        ) {
          for (const panel of addressPanels as any) {
            for (const metric of panel.metrics) {
              if (
                moment(metric.timestamp, "MM/YYYY").isBetween(
                  moment(future.boughtAt, "DD/MM/YYYY"),
                  moment(future.maturityDate, "DD/MM/YYYY"),
                  "month",
                  "(]"
                ) &&
                moment(metric.timestamp, "MM/YYYY").month() != date.month()
              ) {
                panelsProduced += metric.produced;
              }
            }
          }
          const producedDifference = future.quantity - panelsProduced;

          if (producedDifference <= 0) {
            producedSum += produced * reqData.rate;
          } else {
            if (produced >= producedDifference) {
              producedSum += producedDifference * future.rate;
              produced -= producedDifference;
            } else {
              producedSum += produced * future.rate;
              produced = 0;
            }
          }
        }
      }

      if (produced > 0) {
        producedSum += produced * reqData.rate;
        producedSum = Number(producedSum.toFixed(2));
      }

      //Computing consumed data while taking futures bought into account
      let consumed = reqData.consumed;
      let consumedSum = 0;
      let addressConsumed = 0;

      const boughtQ = query(
        collection(db, "futures"),
        where("buyerId", "==", reqData.userid)
      );

      const snapshotBought = await getDocs(boughtQ);

      const addressBought = snapshotBought.docs
        .filter((doc) => doc.data().buyerAddressId == reqData.addressid)
        .sort((a, b) => a.data().createdAt.localeCompare(b.data().createdAt))
        .map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

      const address = await getDoc(doc(db, "addresses", reqData.addressid));

      for (const future of addressBought as any) {
        if (
          future.boughtAt.length > 0 &&
          date.isBetween(
            moment(future.boughtAt, "DD/MM/YYYY"),
            moment(future.maturityDate, "DD/MM/YYYY"),
            "month",
            "(]"
          )
        ) {
          for (const metric of address.data().consumed) {
            if (
              moment(metric.timestamp, "MM/YYYY").isBetween(
                moment(future.boughtAt, "DD/MM/YYYY"),
                moment(future.maturityDate, "DD/MM/YYYY"),
                "month",
                "(]"
              ) &&
              moment(metric.timestamp, "MM/YYYY").month() != date.month()
            ) {
              addressConsumed += metric.newIndex;
            }
          }

          const consumedDifference = future.quantity - addressConsumed;

          if (consumedDifference <= 0) {
            consumedSum += consumed * Number((reqData.rate + 0.55).toFixed(2));
          } else {
            if (consumed >= consumedDifference) {
              consumedSum +=
                consumedDifference * Number((future.rate + 0.55).toFixed(2));
              consumed -= consumedDifference;
            } else {
              consumedSum += consumed * Number((future.rate + 0.55).toFixed(2));
              consumed = 0;
            }
          }
        }
      }

      if (consumed > 0) {
        consumedSum += consumed * Number((reqData.rate + 0.55).toFixed(2));
        consumedSum = Number(consumedSum.toFixed(2));
      }

      const snapshot = await addDoc(collection(db, "bills"), {
        consumed: reqData.consumed,
        produced: reqData.produced,
        rate: reqData.rate,
        total: Number((consumedSum - producedSum).toFixed(2)),
        dateBilled: moment(reqData.date, "DD/MM/YYYY")
          .subtract(1, "month")
          .format("MMMM YYYY"),
        createdAt: moment(reqData.date, "DD/MM/YYYY")
          .startOf("month")
          .format("DD/MM/YYYY"),
        userId: reqData.userid,
        addressId: reqData.addressid,
        isPaid: false,
      });

      if (!snapshot) {
        return res.status(400).send({
          message: "Failed to generate bill",
        });
      }

      res.status(201).send({
        message: "Created bill",
      });
    } catch (err) {
      res.status(500).send({
        message: "Error while generating bill",
      });
    }
  },

  payBill: async (req, res) => {
    try {
      const reqData = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "ron",
              product_data: {
                name: reqData.text,
              },
              unit_amount: Math.round(reqData.total * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          billId: reqData.billId,
        },
        success_url: `http://localhost:4200/bills/${reqData.addressId}`,
        cancel_url: `http://localhost:4200/bills/${reqData.addressId}`,
      });

      res.status(200).send({
        result: { url: session.url },
      });
    } catch (err) {
      res.status(500).send({
        message: "Failed to pay the bill",
      });
    }
  },

  saveTransaction: async (req, res) => {
    try {
      const event = req.body;

      if (event.type == "checkout.session.completed") {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );

        const snapshot = await addDoc(collection(db, "transactions"), {
          amount: session.line_items.data[0].amount_total / 100,
          createdAt: moment().format("DD/MM/YYYY"),
          billId: session.metadata.billId,
          checkoutId: event.data.object.id,
        });

        if (!snapshot) {
          return res.status(400).send({
            message: "Failed to save transaction",
          });
        }

        await updateDoc(doc(db, "bills", session.metadata.billId), {
          isPaid: true,
        });
      }

      res.status(200).send({
        message: "Saved transaction successfully",
      });
    } catch (err) {
      res.status(500).send({
        message: "Failed to save transaction",
      });
    }
  },

  getBillsForAddress: async (req, res) => {
    try {
      const addressId = req.params.id;

      const q = query(
        collection(db, "bills"),
        where("addressId", "==", addressId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no bills available",
        });
      }

      res.status(200).send({
        results: snapshot.docs
          .sort((a, b) => a.data().createdAt.localeCompare(b.data().createdAt))
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
      });
    } catch (err) {
      res.status(500).send({
        message: "Failed to get all bills",
      });
    }
  },

  getAllBillsRevenue: async (req, res) => {
    try {
      const q = query(collection(db, "bills"));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no bills available",
        });
      }

      const bills = snapshot.docs;
      const revenue = [];

      for (let i = 0; i <= 11; i++) {
        const metric = { value: 0, timestamp: "" };
        metric.timestamp = moment().month(i).format("MMMM YYYY");
        metric.value +=
          bills.filter(
            (bill) => moment(bill.data().dateBilled, "MMMM YYYY").month() == i
          ).length > 0
            ? bills
                .filter(
                  (bill) =>
                    moment(bill.data().dateBilled, "MMMM YYYY").month() == i
                )
                .map((bill) => bill.data().total)
                .reduce((a, b) => a + b, 0)
            : 0;

        metric.value = Number(metric.value.toFixed(2));
        revenue.push(metric);
      }

      res.status(200).send({
        results: revenue,
      });
    } catch (err) {
      res.status(500).send({
        message: "Failed to get all bills",
      });
    }
  },
};
