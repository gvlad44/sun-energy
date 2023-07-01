import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../config/db.ts";
import moment from "moment";

interface Panel {
  uuid: string;
  name: string;
  output: number;
  metrics: PanelMetrics[];
  addressId: string;
  userId: string;
}

interface PanelMetrics {
  produced: number;
  timestamp: string;
}

interface PanelPayload {
  name: string;
  output: number;
  noOfMonths: number;
  modifier?: number;
  addressId: string;
  userId: string;
}

const peakSunHours = [
  1.27, 2.35, 3.36, 4.54, 5.85, 6.43, 6.58, 5.78, 4.16, 2.68, 1.47, 1.12,
];

const db = getFirestore(firebaseConfig);

export const panelsController = {
  addPanel: async (req, res) => {
    try {
      const reqData: PanelPayload = req.body;

      const metrics = [];
      const date = moment(new Date(), "MM/YYYY");
      for (let i = 0; i < reqData.noOfMonths; i++) {
        const currentDate = moment(date, "MM/YYYY").subtract(i, "month");
        metrics.push({
          produced: (
            reqData.output *
            peakSunHours[currentDate.month()] *
            moment(currentDate, "MM/YYYY").daysInMonth()
          ).toFixed(2),
          timestamp: currentDate.format("MM/YYYY"),
        });
      }

      if (reqData.modifier) {
        metrics[0].produced = (metrics[0].produced *= reqData.modifier).toFixed(
          2
        );
      }

      const snapshot = await addDoc(collection(db, "panels"), {
        name: reqData.name,
        output: reqData.output,
        metrics: metrics,
        addressId: reqData.addressId,
        userId: reqData.userId,
      });

      if (!snapshot) {
        res.status(400).send({
          message: "Failed to add panel",
        });
      }

      res.status(201).send({
        message: "Created panel",
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when adding a new panel",
      });
    }
  },

  getPanels: async (req, res) => {
    try {
      const addressId = req.params.id;

      const q = query(
        collection(db, "panels"),
        where("addressId", "==", addressId),
        orderBy("name")
      );

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

  getPanel: async (req, res) => {
    try {
      const panelId = req.params.id;

      const q = query(collection(db, "panels"));

      const snapshot = await getDocs(q);

      if (!snapshot) {
        res.status(400).send({
          message: "There are no panels available",
        });
      }

      res.status(200).send({
        results: snapshot.docs
          .filter((doc) => doc.id === panelId)
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
};
