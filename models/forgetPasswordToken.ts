import mongoose, { Schema, models } from "mongoose";

interface ForgetPasswordTokenDocument extends Document {
  email: string;
  token: string;
  expires: Date;
}

const ForgetPasswordTokenSchema = new Schema<ForgetPasswordTokenDocument>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

const ForgetPasswordToken =
  models?.ForgetPasswordToken ||
  mongoose?.model("ForgetPasswordToken", ForgetPasswordTokenSchema);

export default ForgetPasswordToken;
