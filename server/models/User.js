import mongoose from "mongoose";

const { Schema } = mongoose;

// User schema for the database
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    incomes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Income",
      },
    ],
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    budgets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Budget",
      },
    ],
    savingGoals: [
      {
        type: Schema.Types.ObjectId,
        ref: "SavingGoal",
      },
    ],
    verifiedUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
