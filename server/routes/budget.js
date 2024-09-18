import express from "express";
import { getBudgets, postBudget, deleteBudget } from "../controllers/budget.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* READ */
router.get("/:userId/budgets", verifyToken, getBudgets);

/* CREATE */
router.post("/:userId/budgets", verifyToken, upload.none(), postBudget);

/* DELETE */
router.delete("/:userId/:id", verifyToken, deleteBudget);

export default router;
