"use server";
import { LoginSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import jwt from "jsonwebtoken";
import ForgetPasswordToken from "@/models/forgetPasswordToken";
import TwoFACode from "@/models/twoFACode";
import TwoFAConfirmation from "@/models/twoFAConfirmation";
import VerificationToken from "@/models/VerificationToken";

export async function generateEmailVerificationToken(params) {
  try {
    const { email } = params;

    const existingToken = await VerificationToken.findOne({ email });

    if (existingToken) {
      await VerificationToken.findOneAndDelete({ email });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    VerificationToken.create({
      email, // Author of the interaction
      token, // Action type
      expires: new Date(Date.now() + 60 * 60 * 1000 * 1), //1h
    });

    return { token };
  } catch (error) {
    console.log(error.message);
  }
}

export async function generateEmailForgetPasswordToken(params) {
  try {
    const { email } = params;

    const existingToken = await ForgetPasswordToken.findOne({ email });

    if (existingToken) {
      await ForgetPasswordToken.findOneAndDelete({ email });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    ForgetPasswordToken.create({
      email, // Author of the interaction
      token, // Action type
      expires: new Date(Date.now() + 60 * 60 * 1000 * 1), //1h
    });

    return { token };
  } catch (error) {
    console.log(error.message);
  }
}

export async function generateTwoFACode(params) {
  try {
    const { email } = params;

    const existingCode = await TwoFACode.findOne({ email });

    if (existingCode) {
      await TwoFACode.findOneAndDelete({ email });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    TwoFACode.create({
      email,
      code,
      expires: new Date(Date.now() + 60 * 60 * 1000 * 1), //1h
    });

    // TwoFAConfirmation.create({
    //   email, // Author of the interaction
    // });

    return { code };
  } catch (error) {
    console.log(error.message);
  }
}
