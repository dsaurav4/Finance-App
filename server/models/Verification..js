import mongoose from "mongoose";

const { Schema } = mongoose;

const VerificationSchema = new Schema(
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

const Verification = mongoose.model("Verification", VerificationSchema);

export default Verification;
