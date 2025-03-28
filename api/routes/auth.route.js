import express from "express";
import {
  google,
  signin,
  signOutUser,
  signup,
} from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/google", google);

router.post("/signout/:id", verifyUserToken, signOutUser);

export default router;
