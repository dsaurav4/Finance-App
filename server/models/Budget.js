import mongoose from "mongoose";

const { Schema } = mongoose;

const BudgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      type: String,
      enum: ["Weekly", "Monthly", "Yearly"],
      required: true,
    },
    amount: {
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

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
