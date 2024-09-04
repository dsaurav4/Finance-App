import express from "express";
import { login, register, verifyCode } from "../controllers/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* LOGIN */
router.post("/login", login);

/* REGISTER */
router.post("/register", upload.single("picture"), register);

/* VERIFY USER */
router.get("/verify/:userId/:code", verifyCode);

export default router;
