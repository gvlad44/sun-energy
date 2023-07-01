import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { firebaseConfig } from "../config/db.ts";

interface Address {
  uuid: string;
  address: string;
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
  contractStartDate: string;
  contractEndDate: string;
  pod: string;
  series: string;
  index: string;
}

const db = getFirestore(firebaseConfig);

export const addressController = {
  addAddress: async (req, res) => {
    try {
      const reqData: AddressPayload = req.body;
      const snapshot = await addDoc(collection(db, "address"), {
        address: reqData.address,
        status: "Requested",
        rate: 0.25,
        isEnabled: false,
        contractStartDate: reqData.contractStartDate,
        contractEndDate: reqData.contractEndDate,
        pod: reqData.pod,
        series: reqData.series,
        index: reqData.index,
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
      const snapshot = await getDocs(collection(db, "address"));

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
};
