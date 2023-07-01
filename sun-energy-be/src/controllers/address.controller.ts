import {
  Timestamp,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../config/db.ts";
import { v4 as uuidv4 } from "uuid";

interface Address {
  uuid: string;
  address: string;
  rate: number;
  isEnabled: boolean;
  contractStartDate: string;
  contractEndDate: string;
  createdAt?: any;
}

const db = getFirestore(firebaseConfig);

export const addressController = {
  addAddress: async (req, res) => {
    try {
      const reqData: Address = req.body;
      const dbRes = await setDoc(doc(db, "address"), {
        uuid: uuidv4(),
        address: reqData.address,
        rate: reqData.rate,
        isEnabled: false,
        contractStartDate: reqData.contractStartDate,
        contractEndDate: reqData.contractEndDate,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log(dbRes);
      res.status(201).send({
        message: "Added new address",
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to add a new address",
      });
    }
  },

  getAddresses: async (req, res) => {
    try {
      const dbRes = await getDoc(doc(db, "addresses"));

      if (!dbRes) {
        res.status(400).send({
          message: "There are no addresses available",
        });
      }

      res.status(200).send({
        results: dbRes,
      });
    } catch (err) {
      res.status(400).send({
        message: "Failed to get all addresses",
      });
    }
  },
};
