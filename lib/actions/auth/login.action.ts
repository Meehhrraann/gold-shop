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
    if (!validatedFields.success) return { error: "Invalid fields!" };
    const { email, password, code } = validatedFields.data;

    const user = await User.findOne({ email });
    if (!user) return { error: "User not found!" };

    if (user && !user.password)
      return {
        error: "please use forget password or use Github | Google for sign in",
      };

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: "password not match" };
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
      if (!userExistedCode) return { error: "invalid code" };

      const codeMatched = code === userExistedCode?.code;
      if (!codeMatched) return { error: "code not match" };

      const codeExpired = userExistedCode.expires > Date.now();
      if (!codeExpired) {
        await TwoFACode.findOneAndDelete({ email });
        return { error: "code expired" };
      }
      await TwoFAConfirmation.findOneAndDelete({ email });
      await TwoFACode.findOneAndDelete({ email });
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "successful login" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          console.log(error.type);
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
