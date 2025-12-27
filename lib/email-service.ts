import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  verificationLink: string,
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendForgetPasswordEmail = async (
  email: string,
  verificationLink: string,
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Forget Password",
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">click here</a>
      `,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
