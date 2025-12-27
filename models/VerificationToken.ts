import mongoose, { Schema, models } from "mongoose";

interface VerificationTokenDocument extends Document {
  email: string;
  token: string;
  expires: Date;
}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

const VerificationToken =
  models?.VerificationToken ||
  mongoose?.model("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
