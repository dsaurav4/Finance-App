import mongoose from "mongoose";

const { Schema } = mongoose;

const BudgetStreakSchema = new Schema(
  {
    budgetId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    underBudget: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const BudgetStreak = mongoose.model("BudgetStreak", BudgetStreakSchema);

export default BudgetStreak;
