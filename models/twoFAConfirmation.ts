import mongoose, { Schema, models } from "mongoose";

interface TwoFAConfirmationDocument extends Document {
  email: string;
  code: string;
  expires: Date;
}

const TwoFAConfirmationSchema = new Schema<TwoFAConfirmationDocument>(
  {
    email: { type: String, required: true },
  },
  { timestamps: true },
);

const TwoFAConfirmation =
  models?.TwoFAConfirmation ||
  mongoose?.model("TwoFAConfirmation", TwoFAConfirmationSchema);

export default TwoFAConfirmation;
