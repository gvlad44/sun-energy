import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../config/db.ts";
import { getAuth } from "firebase/auth";
import moment from "moment";

const db = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

interface Future {
  quantity: number;
  rate: number;
  total: number;
  maturityDate: string;
  createdAt: string;
  userId: string;
  addressId: string;
  boughtAt: string;
  buyerId: string;
  buyerAddressId: string;
}

interface FuturePayload {
  quantity: number;
  rate: number;
  maturityDate: number;
  addressId: string;
}

export const futuresController = {
  listFuture: async (req, res) => {
    try {
      const userId = auth.currentUser.uid;
      const reqData: FuturePayload = req.body;

      const snapshot = await addDoc(collection(db, "futures"), {
        quantity: reqData.quantity,
        rate: Number(reqData.rate),
        total: Number((reqData.rate * reqData.quantity).toFixed(2)),
        maturityDate: moment(new Date(), "DD/MM/YYYY")
          .add(reqData.maturityDate, "month")
          .endOf("month")
          .format("DD/MM/YYYY"),
        createdAt: moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY"),
        userId: userId,
        addressId: reqData.addressId,
        boughtAt: "",
        buyerId: "",
        buyerAddressId: "",
      });

      if (!snapshot) {
        return res.status(400).send({
          message: "Failed to add new list item",
        });
      }

      res.status(201).send({
        message: "Created new list item",
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when adding a new list item",
      });
    }
  },

  getUserListedFutures: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;

      const q = query(collection(db, "futures"), where("userId", "==", userid));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no listed energy futures",
        });
      }

      res.status(200).send({
        results: snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all listed energy futures",
      });
    }
  },

  getAddressListedFutures: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;
      const addressid = req.params.id;

      const q = query(collection(db, "futures"), where("userId", "==", userid));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no listed energy futures",
        });
      }

      res.status(200).send({
        results: snapshot.docs
          .filter((doc) => doc.data().addressId === addressid)
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all listed energy futures",
      });
    }
  },

  getAvailableListings: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;

      const q = query(collection(db, "futures"), where("userId", "!=", userid));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no listed energy futures",
        });
      }

      res.status(200).send({
        results: snapshot.docs
          .filter((doc) => doc.data().boughtAt.length == 0)
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all listed energy futures",
      });
    }
  },

  getBoughtListings: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;

      const q = query(
        collection(db, "futures"),
        where("buyerId", "==", userid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no bought energy futures",
        });
      }

      res.status(200).send({
        results: snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all bought energy futures",
      });
    }
  },

  buyListedFuture: async (req, res) => {
    try {
      const buyerid = auth.currentUser.uid;
      const uuid = req.params.id;
      const buyerAddressId = req.body.buyerAddressId;

      await updateDoc(doc(db, "futures", uuid), {
        boughtAt: moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY"),
        buyerId: buyerid,
        buyerAddressId: buyerAddressId,
      });

      const snapshotAddress = await getDoc(
        doc(db, "addresses", buyerAddressId)
      );
      const snapshotFuture = await getDoc(doc(db, "futures", uuid));

      if (
        moment(snapshotAddress.data().contractEndDate, "DD/MM/YYYY").isBefore(
          moment(snapshotFuture.data().maturityDate, "DD/MM/YYYY"),
          "month"
        )
      ) {
        await updateDoc(doc(db, "addresses", buyerAddressId), {
          contractEndDate: moment(
            snapshotFuture.data().maturityDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
        });
      }
      res.status(200).send({
        message: "Bought energy future successfully",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to buy energy future",
      });
    }
  },

  deleteListedFuture: async (req, res) => {
    try {
      const uuid = req.params.id;

      await deleteDoc(doc(db, "futures", uuid));

      res.status(200).send({
        message: "Deleted listed energy future",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to delete listing",
      });
    }
  },
};
