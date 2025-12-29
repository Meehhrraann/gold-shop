"use server";

import { LoginSchema } from "@/validation";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from "@/lib/email-service";
import {
  generateEmailVerificationToken,
  generateTwoFACode,
} from "@/lib/tokens";
import TwoFACode from "@/models/twoFACode";
import TwoFAConfirmation from "@/models/twoFAConfirmation";

export async function loginAction(params) {
  try {
    await connectMongoDB();
    const { values, callbackUrl } = params;

    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) return { error: "فیلدها نامعتبر است" };
    const { email, password, code } = validatedFields.data;

    const user = await User.findOne({ email });
    if (!user) return { error: "کاربر یافت نشد" };

    if (user && !user.password)
      return {
        error:
          "از فراموشی رمز استفاده نمایید و یا با google یا github وارد شوید",
      };

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: "رمز وارد شده صحیح نیست" };
    }

    //todo uncomment later
    // if (!user.emailVerified) {
    //   const verificationToken = await generateEmailVerificationToken({
    //     email: user.email,
    //   });
    //   const verificationLink = `${process.env.API_SERVER_BASE_URL}/auth/new-verification?token=${verificationToken?.token}`;
    //   await sendVerificationEmail(user.email, verificationLink);
    //   return { success: "verification email is sent" };
    // }

    if (user.isTwoFactorEnabled) {
      if (!code) {
        await TwoFAConfirmation.findOneAndDelete({ email });
        const code = await generateTwoFACode({ email });
        console.log(code);
        TwoFAConfirmation.create({ email });
        return { isTwoFA: true };
      }

      // code verification
      const userExistedCode = await TwoFACode.findOne({ email, code });
      console.log(userExistedCode);
      if (!userExistedCode) return { error: "کد نامعتبر است" };

      const codeMatched = code === userExistedCode?.code;
      if (!codeMatched) return { error: "کد وارد شده صحیح نیست" };

      const codeExpired = userExistedCode.expires > Date.now();
      if (!codeExpired) {
        await TwoFACode.findOneAndDelete({ email });
        return { error: "کد منقضی شده است" };
      }
      await TwoFAConfirmation.findOneAndDelete({ email });
      await TwoFACode.findOneAndDelete({ email });
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "ورود با موفقیت انجام شد" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "اطلاعات وارد شده صحیح نیست" };
        default:
          console.log(error.type);
          return { error: "خطایی رخ داده است" };
      }
    }
    throw error;
  }
}
