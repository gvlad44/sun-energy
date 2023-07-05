import express from "express";
import { userController } from "../controllers/users.controller.ts";
import { addressController } from "../controllers/address.controller.ts";
import { middlewares } from "../controllers/middleware.controller.ts";
import { panelsController } from "../controllers/panels.controller.ts";
import { futuresController } from "../controllers/futures.controller.ts";
import { billsController } from "../controllers/bills.controller.ts";
export const router = express.Router();

//Auth routes
router.post("/register", userController.register);
router.post("/reset", userController.resetPassword);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

//Address routes
router.post("/address", middlewares.isAuth, addressController.addAddress);
router.post("/address/:id", addressController.addNewIndex);
router.get("/address", middlewares.isAuth, addressController.getAddresses);
router.get("/address/:id", middlewares.isAuth, addressController.getAddress);
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

//Panel routes
router.post("/panel", panelsController.addPanel);
router.get("/panel", middlewares.isAuth, panelsController.getPanelsForUser);
router.get(
  "/panel/address/:id",
  middlewares.isAuth,
  panelsController.getPanelsForAddress
);
router.get("/panel/:id", middlewares.isAuth, panelsController.getPanel);

//Futures routes
router.post("/futures/sell", middlewares.isAuth, futuresController.listFuture);
router.get("/futures/all", middlewares.isAuth, futuresController.getAllFutures);
router.get(
  "/futures/:id",
  middlewares.isAuth,
  futuresController.getAddressListedFutures
);
router.get(
  "/futures",
  middlewares.isAuth,
  futuresController.getUserListedFutures
);
router.get(
  "/generated",
  middlewares.isAuth,
  futuresController.getGeneratedRevenueForUser
);
router.get(
  "/available",
  middlewares.isAuth,
  futuresController.getAvailableListings
);
router.get("/bought", middlewares.isAuth, futuresController.getBoughtListings);
router.patch(
  "/futures/:id",
  middlewares.isAuth,
  futuresController.buyListedFuture
);
router.delete(
  "/futures/:id",
  middlewares.isAuth,
  futuresController.deleteListedFuture
);

//Bills routes
router.post("/bills", billsController.generateBillForMonth);
router.post("/bills/pay", middlewares.isAuth, billsController.payBill);
router.post("/webhooks", billsController.saveTransaction);
router.get(
  "/bills/:id",
  middlewares.isAuth,
  billsController.getBillsForAddress
);
router.get("/bills", middlewares.isAuth, billsController.getAllBillsRevenue);
