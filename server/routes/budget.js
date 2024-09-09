import express from "express";
import {
  getBudgets,
  postBudget,
  deleteBudget,
  updateBudget,
} from "../controllers/budget.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* READ */
router.get("/:userId/budgets", verifyToken, getBudgets);

/* CREATE */
router.post("/:userId/budgets", verifyToken, upload.none(), postBudget);

/* UPDATE */
router.patch("/budgets/:id", verifyToken, upload.none(), updateBudget);

/* DELETE */
router.delete("/:userId/budgets/:id", verifyToken, deleteBudget);

export default router;
