import express from "express";
import { userController } from "../controllers/users.controller.ts";
import { addressController } from "../controllers/address.controller.ts";
import { middlewares } from "../controllers/middleware.controller.ts";
export const router = express.Router();

//Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

//Address routes
router.post("/address", middlewares.isAuth, addressController.addAddress);
router.get("/address", middlewares.isAuth, addressController.getAddresses);
router.patch(
  "/address/:id",
  middlewares.isAuth,
  addressController.extendAddressContract
);
router.delete(
  "/address/:id",
  middlewares.isAuth,
  addressController.deleteAddress
);
