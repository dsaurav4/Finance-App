import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema for the SavingGoal collection in the database
const SavingGoalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalName: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const SavingGoal = mongoose.model("SavingGoal", SavingGoalSchema);

export default SavingGoal;
