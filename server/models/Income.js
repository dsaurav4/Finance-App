import mongoose from "mongoose";

const { Schema } = mongoose;

// Income schema for the database
const IncomeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Salary",
        "Freelance",
        "Investments",
        "Gifts",
        "Business",
        "Other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", IncomeSchema);

export default Income;
