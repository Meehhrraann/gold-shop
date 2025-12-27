"use server";

import { RegisterSchema } from "@/validation";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateEmailVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email-service";

export async function registerAction(params: z.infer<typeof RegisterSchema>) {
  try {
    await connectMongoDB();
    const values = params;

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) return { error: "invalid fields!" };

    const { email, password, name } = validatedFields.data;

    const userExists = await User.findOne({ email });
    if (userExists) return { error: "Email already exists!" };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      name: name,
    });

    const verificationToken = await generateEmailVerificationToken({ email });
    const verificationLink = `${process.env.API_SERVER_BASE_URL}/auth/new-verification?token=${verificationToken?.token}`;
    await sendVerificationEmail(email, verificationLink);

    return { success: "verification email sent !" };

    // revalidatePath(path);
  } catch (error: any) {
    return { error: error.message };
    console.error(error);
  }
}
