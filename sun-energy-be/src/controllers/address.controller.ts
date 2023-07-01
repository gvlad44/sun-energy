import {
  addDoc,
  collection,
  doc,
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
      const snapshot = await addDoc(collection(db, "address"), {
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
        userid: userid,
      });

      if (!snapshot) {
        res.status(400).send({
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

  getAddresses: async (req, res) => {
    try {
      const userid = auth.currentUser.uid;

      const q = query(collection(db, "address"), where("userid", "==", userid));
      const snapshot = await getDocs(q);

      if (!snapshot) {
        res.status(400).send({
          message: "There are no addresses available",
        });
      }

      res.status(200).send({
        results: snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }),
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "Failed to get all addresses",
      });
    }
  },

  extendAddressContract: async (req, res) => {
    try {
      const uuid = req.params.id;
      const extendedContractNewEndDate = req.body.contractEndDate;

      await updateDoc(doc(db, "address", uuid), {
        contractEndDate: extendedContractNewEndDate,
      });

      res.status(200).send({
        message: "Extended contract successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "Failed to extend address contract",
      });
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const uuid = req.params.id;

      await updateDoc(doc(db, "address", uuid), {
        status: "Disabled",
      });

      res.status(200).send({
        message: "Launched contract deletion successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "Failed to launch contract deletion ",
      });
    }
  },
};
