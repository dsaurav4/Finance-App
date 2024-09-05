import express from "express";
import {
  getIncome,
  getExpense,
  postIncome,
  postExpense,
  editIncome,
  editExpense,
  deleteIncome,
  deleteExpense,
} from "../controllers/transactions.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* READ */
router.get("/:userId/income", verifyToken, getIncome);
router.get("/:userId/expense", verifyToken, getExpense);

/* CREATE */
router.post("/:userId/income", verifyToken, upload.none(), postIncome);
router.post("/:userId/expense", verifyToken, upload.none(), postExpense);

/* UPDATE */
router.patch("/income/:id", verifyToken, upload.none(), editIncome);
router.patch("/expense/:id", verifyToken, upload.none(), editExpense);

/* DELETE */
router.delete("/:userId/income/:id", verifyToken, deleteIncome);
router.delete("/:userId/expense/:id", verifyToken, deleteExpense);

export default router;
