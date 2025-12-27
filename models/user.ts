import mongoose, { Schema, models } from "mongoose";

const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const userSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String },
    email: { type: String, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorConfirmation: {
      type: Schema.Types.ObjectId,
      ref: "TwoFactorConfirmation",
    },
    twoFactorConfirmationId: { type: Schema.Types.ObjectId },
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
);

const User = models?.User || mongoose?.model("User", userSchema);
export default User;
