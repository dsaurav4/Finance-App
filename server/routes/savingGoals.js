import express from "express";
import {
  getSavingGoals,
  postSavingGoals,
  deleteSavingGoals,
  updateSavingGoal,
} from "../controllers/savingGoals.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

/* GET */
router.get("/:userId", verifyToken, getSavingGoals);

/* CREATE */
router.post("/:userId", verifyToken, upload.none(), postSavingGoals);

/* UPDATE */
router.patch("/:userId/:id", verifyToken, upload.none(), updateSavingGoal);

/* DELETE */
router.delete("/:userId/:id", verifyToken, deleteSavingGoals);

export default router;
