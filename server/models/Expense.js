import mongoose from "mongoose";

const { Schema } = mongoose;

// Expense schema for the database
const ExpenseSchema = new Schema(
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
        "Rent",
        "Utilities",
        "Groceries",
        "Food",
        "Entertainment",
        "Travel",
        "Healthcare",
        "Education",
        "Other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
