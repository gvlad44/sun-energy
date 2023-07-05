import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseConfig } from "../config/db.ts";

interface UserAuth {
  email: string;
  password: string;
}

const auth = getAuth(firebaseConfig);

export const userController = {
  register: async (req, res) => {
    try {
      const reqUser: UserAuth = req.body;
      const firebaseRes = await createUserWithEmailAndPassword(
        auth,
        reqUser.email,
        reqUser.password
      );

      if (!firebaseRes.user) {
        return res.status(400).send({
          message: "Failed to create user",
        });
      }

      res.status(201).send({
        message: "User created",
      });
    } catch (err) {
      res.status(500).send({
        message: "E-mail already in use",
      });
    }
  },

  login: async (req, res) => {
    try {
      const reqData: UserAuth = req.body;
      const firebaseRes = await signInWithEmailAndPassword(
        auth,
        reqData.email,
        reqData.password
      );

      if (!firebaseRes.user) {
        return res.status(400).send({
          message: "Wrong email and/or password",
        });
      }

      res.status(200).send({
        message: "Logged in",
        result: {
          uuid: firebaseRes.user.uid,
          email: firebaseRes.user.email,
        },
      });
    } catch (err) {
      res.status(500).send({
        message: "Error while logging in",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const reqData = req.body;

      await sendPasswordResetEmail(auth, reqData.email);

      res.status(200).send({
        message: "Successfully sent email",
      });
    } catch (err) {
      res.status(500).send({
        message: "Error while sending email",
      });
    }
  },

  logout: async (req, res) => {
    try {
      await signOut(auth);

      res.status(200).send({
        message: "Logged out",
      });
    } catch (err) {
      res.status(500).send({
        message: "Error while logging out",
      });
    }
  },
};
