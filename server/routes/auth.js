import express from "express";
import {
  login,
  register,
  verifyCode,
  resetPassword,
  verifyResetCode,
  updatePassword,
} from "../controllers/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* LOGIN */
router.post("/login", login);

/* REGISTER */
router.post("/register", upload.single("picture"), register);

/* VERIFY USER */
router.get("/verify/:userId/:code", verifyCode);

/* PASSWORD RESET */
router.post("/resetPassword", upload.none(), resetPassword);
router.post("/verifyResetCode/:userId", upload.none(), verifyResetCode);
router.patch("/updatePassword/:userId", upload.none(), updatePassword);

export default router;
