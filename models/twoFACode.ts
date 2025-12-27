import mongoose, { Schema, models } from "mongoose";

interface TwoFACodeDocument extends Document {
  email: string;
  code: string;
  expires: Date;
}

const TwoFACodeSchema = new Schema<TwoFACodeDocument>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

const TwoFACode =
  models?.TwoFACode || mongoose?.model("TwoFACode", TwoFACodeSchema);

export default TwoFACode;
