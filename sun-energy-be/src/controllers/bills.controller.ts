import { firebaseConfig } from "../config/db.ts";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import moment from "moment";

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

const db = getFirestore(firebaseConfig);

export const billsController = {
  generateBillForMonth: async (req, res) => {
    try {
      const reqData: BillPayload = req.body;

      const futuresQ = query(
        collection(db, "futures"),
        where("userId", "==", "uOSkjQAAKgXAO1RMMOwQy32UL7b2")
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
        where("userId", "==", "uOSkjQAAKgXAO1RMMOwQy32UL7b2")
      );

      const snapshotPanels = await getDocs(panelsQ);

      const addressPanels: any = snapshotPanels.docs
        .filter((doc) => doc.data().addressId == reqData.addressid)
        .map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

      const date = moment(reqData.date, "DD/MM/YYYY");
      let produced = reqData.produced;
      let producedSum = 0;
      let panelsProduced = 0;
      for (const future of addressFutures as any) {
        if (
          date.isBetween(
            moment(future.createdAt, "DD/MM/YYYY"),
            moment(future.maturityDate, "DD/MM/YYYY"),
            "month",
            "(]"
          )
        ) {
          for (const panel of addressPanels as any) {
            for (const metric of panel.metrics) {
              if (
                moment(metric.timestamp, "MM/YYYY").isBetween(
                  moment(future.createdAt, "DD/MM/YYYY"),
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

      const snapshot = await addDoc(collection(db, "bills"), {
        consumed: reqData.consumed,
        produced: reqData.produced,
        rate: reqData.rate,
        total: Number(
          (reqData.consumed * (reqData.rate + 0.55) - producedSum).toFixed(2)
        ),
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
      console.log(err);
      res.status(400).send({
        message: "Error while generating bill",
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
      res.status(400).send({
        message: "Failed to get all panels",
      });
    }
  },
};
