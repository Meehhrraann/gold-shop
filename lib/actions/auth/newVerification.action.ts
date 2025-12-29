"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import VerificationToken from "@/models/VerificationToken";
import jwt from "jsonwebtoken";

export async function newVerification(params) {
  try {
    await connectMongoDB();
    const { token } = params;

    const existingToekn = await VerificationToken.findOne({ token });
    if (!existingToekn) {
      return { error: "توکن وجود ندارد" };
    }
    if (existingToekn.expires < new Date()) {
      console.log("expired");
      return { error: "توکن منقضی شده" };
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      console.log("token is not valid");
      return { error: "توکن معتبر نیست" };
    }
    await User.findOneAndUpdate(
      { email: decodedToken.email },
      { emailVerified: new Date() },
    );
    await VerificationToken.findOneAndDelete({ token });
    return { success: "تایید شد" };
  } catch (error: any) {
    return { error: error.message };
    console.error(error);
  }
}
