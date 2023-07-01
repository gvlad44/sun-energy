import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
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
        rate: reqData.rate,
        total: reqData.rate * reqData.quantity,
        maturityDate: moment(new Date(), "DD/MM/YYYY")
          .add(reqData.maturityDate, "month")
          .endOf("month")
          .format("DD/MM/YYYY"),
        createdAt: moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY"),
        userId: userId,
        addressId: reqData.addressId,
        boughtAt: "",
        buyerId: "",
      });

      if (!snapshot) {
        res.status(400).send({
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
        res.status(400).send({
          message: "There are no panels available",
        });
      }

      res.status(200).send({
        results: snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all panels",
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
        res.status(400).send({
          message: "There are no panels available",
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
        message: "Failed to get all panels",
      });
    }
  },
};
