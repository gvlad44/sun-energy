import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../config/db.ts";

const auth = getAuth(firebaseConfig);

export const middlewares = {
  isAuth: async (req, res, next) => {
    const user = auth.currentUser;

    if (!user) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      return next();
    }
  },
};
