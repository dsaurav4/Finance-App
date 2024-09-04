import express from "express";
import {
  getSavingGoals,
  postSavingGoals,
  deleteSavingGoals,
  updateSavingGoal,
} from "../controllers/savingGoals.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/:userId/savingGoals", verifyToken, getSavingGoals);

/* CREATE */
router.post("/:userId/savingGoals", verifyToken, postSavingGoals);

/* UPDATE */
router.patch("/:userId/savingGoals/:id", verifyToken, updateSavingGoal);

/* DELETE */
router.delete("/:userId/savingGoals/:id", verifyToken, deleteSavingGoals);

export default router;
