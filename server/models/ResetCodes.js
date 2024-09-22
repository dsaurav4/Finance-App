import mongoose from "mongoose";

const { Schema } = mongoose;

// Reset code schema for the database
const ResetCodeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 3600000,
    },
  },
  { timestamps: true }
);

const ResetCode = mongoose.model("ResetCode", ResetCodeSchema);

export default ResetCode;
