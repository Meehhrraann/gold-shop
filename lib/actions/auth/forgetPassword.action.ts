"use server";

import { NewPasswordSchema, ResetPasswordSchema } from "@/validation";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendForgetPasswordEmail } from "@/lib/email-service";
import { generateEmailForgetPasswordToken } from "@/lib/tokens";
import jwt from "jsonwebtoken";
import ForgetPasswordToken from "@/models/forgetPasswordToken";

export async function forgetPasswordSendEmail(params) {
  try {
    await connectMongoDB();
    const values = params;

    const validatedFields = ResetPasswordSchema.safeParse(values);
    if (!validatedFields.success) return { error: "اطلاعات نامعتبر است" };
    const { email } = validatedFields.data;

    const user = await User.findOne({ email });
    if (!user) return { error: "کاربر یافت نشد" };

    const forgetPasswordToken = await generateEmailForgetPasswordToken({
      email: user.email,
    });
    const verificationLink = `${process.env.API_SERVER_BASE_URL}/auth/new-password?token=${forgetPasswordToken?.token}`;
    await sendForgetPasswordEmail(user.email, verificationLink);

    return { success: "ایمیل با موفقیت ارسال شد" };
  } catch (error) {
    console.log(error.type);
    return { error: "مشکلی رخ داد" };
  }
}

export async function forgetPasswordChange(params) {
  try {
    await connectMongoDB();
    const { values, token } = params;

    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) return { error: "اطلاعات نامعتبر است" };
    const { password } = validatedFields.data;

    const existingToken = await ForgetPasswordToken.findOne({ token });
    if (!existingToken) return { error: "توکن یافت نشد" };

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) return { error: "توکن نا معتبر است" };

    const user = await User.findOne({ email: decodedToken.email });
    if (!user) return { error: "کاربر یافت نشد" };

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(decodedToken.email);
    console.log(password);

    const newUser = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { password: hashedPassword },
    );

    await ForgetPasswordToken.findOneAndDelete({ token });

    console.log(newUser);

    return { success: "رمز عبور با موفقیت تغییر یافت" };
  } catch (error) {
    console.log(error.type);
    return { error: "مشکلی رخ داد" };
  }
}
