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
import { firebaseConfig } from "../config/db.ts";
import { getAuth } from "firebase/auth";

interface Address {
  uuid: string;
  address: string;
  city: string;
  status: "Active" | "Disabled" | "Requested";
  rate: number;
  isEnabled: boolean;
  contractStartDate: string;
  contractEndDate: string;
  pod: string;
  series: string;
  index: string;
  consumed: [{ newIndex: number; timestamp: string }];
}

interface AddressPayload {
  address: string;
  city: string;
  contractStartDate: string;
  contractEndDate: string;
  pod: string;
  series: string;
  index: string;
  userid: string;
}

const db = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

export const addressController = {
  addAddress: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;
      const reqData: AddressPayload = req.body;
      const snapshot = await addDoc(collection(db, "addresses"), {
        address: reqData.address,
        city: reqData.city,
        status: "Requested",
        rate: 0.25,
        isEnabled: false,
        contractStartDate: reqData.contractStartDate,
        contractEndDate: reqData.contractEndDate,
        pod: reqData.pod,
        series: reqData.series,
        index: reqData.index,
        consumed: [],
        userid: userid,
      });

      if (!snapshot) {
        return res.status(400).send({
          message: "Failed to add a new address",
        });
      }

      res.status(201).send({
        message: "Created address",
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when adding a new address",
      });
    }
  },

  addNewIndex: async (req, res) => {
    try {
      const uuid = req.params.id;
      const newIndexObj = req.body.newIndexObj;

      const snapshot = await getDoc(doc(db, "addresses", uuid));

      const consumed = (snapshot.data() as Address).consumed
        ? (snapshot.data() as Address).consumed
        : [];

      consumed.unshift(newIndexObj);

      await updateDoc(doc(db, "addresses", uuid), {
        consumed: consumed,
      });

      res.status(200).send({
        message: "Added new index",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to submit new index",
      });
    }
  },

  getAddresses: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;

      const q = query(
        collection(db, "addresses"),
        where("userid", "==", userid)
      );
      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no addresses available",
        });
      }

      res.status(200).send({
        results: snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all addresses",
      });
    }
  },

  getAddress: async (req, res) => {
    try {
      const addressId = req.params.id;

      const q = query(collection(db, "addresses"));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        return res.status(400).send({
          message: "There are no panels available",
        });
      }

      res.status(200).send({
        results: snapshot.docs
          .filter((doc) => doc.id === addressId)
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          }),
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get panel",
      });
    }
  },

  extendAddressContract: async (req, res) => {
    try {
      const uuid = req.params.id;
      const extendedContractNewEndDate = req.body.contractEndDate;

      await updateDoc(doc(db, "addresses", uuid), {
        contractEndDate: extendedContractNewEndDate,
      });

      res.status(200).send({
        message: "Extended contract successfully",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to extend address contract",
      });
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const uuid = req.params.id;

      await updateDoc(doc(db, "addresses", uuid), {
        status: "Disabled",
      });

      res.status(200).send({
        message: "Launched contract deletion successfully",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to launch contract deletion ",
      });
    }
  },
};
