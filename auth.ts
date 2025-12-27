// import NextAuth from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import User from "./models/user";
// import { MongoClient } from "mongodb";
// import Account from "./models/account";
// import { connectMongoDB } from "./lib/mongodb";
// import jwt from "jsonwebtoken";
// import authConfig from "@/auth.config";

// // MongoDB connection setup for Auth.js adapter
// const client = new MongoClient(process.env.MONGODB_URI!);
// const clientPromise = client.connect();

// // Define user roles for type safety
// const UserRole = {
//   ADMIN: "ADMIN",
//   USER: "USER",
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//   },
//   events: {
//     // Update email verification when user links OAuth account
//     async linkAccount({ user }) {
//       await connectMongoDB();
//       await User.findByIdAndUpdate(user.id, { emailVerified: new Date() });
//     },
//   },

//   callbacks: {
//     async signIn({ user, account }) {
//       // Allow OAuth providers to skip email verification
//       if (account?.provider !== "credentials") return true;

//       const existingUser = await User.findById(user.id);

//       // Add email verification check here if needed
//       // if (!existingUser?.emailVerified) return false;

//       // Two-factor authentication check (commented out for now)
//       // if (existingUser.isTwoFactorEnabled) {
//       //   const twoFactorConfirmation = await TwoFAConfirmation.findOne({
//       //     email: existingUser?.email,
//       //   });
//       //   if (!twoFactorConfirmation) return false;
//       //   await TwoFAConfirmation.findOneAndDelete({
//       //     email: existingUser?.email,
//       //   });
//       // }

//       return true;
//     },

//     async session({ token, session }) {
//       await connectMongoDB();

//       // Check for refresh token expiration and return error
//       if (token?.error === "RefreshTokenError") {
//         console.log("Refresh token has expired");
//         return { ...session, error: "RefreshTokenExpired" };
//       }

//       // Set basic user info from token
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }

//       if (token.role && session.user) {
//         session.user.role = token.role as string;
//       }

//       // Populate all required session user fields from token
//       if (session.user) {
//         session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//         session.user.isOAuth = token.isOAuth as boolean;
//         session.user.isPasswordExist = token.isPasswordExist as boolean;
//         session.user.accessToken = token.accessToken as string;
//         session.user.ATExpireAt = token.ATExpireAt as number;
//         session.user.RTExpireAt = token.RTExpireAt as number;
//         session.user.image = (token.image as string) || "";
//       }

//       return session;
//     },

//     async jwt({ token, user, account, trigger, session }) {
//       await connectMongoDB();

//       // Return early if no user ID in token
//       if (!token.sub) return token;

//       const existingUser = await User.findById(token.sub);
//       if (!existingUser) return token;

//       const existingAccount = await Account.findOne({
//         userId: existingUser.id,
//       });

//       // Handle session updates from client side
//       if (trigger === "update") {
//         if (session.user) {
//           token.email = session.user?.email;
//           token.name = session.user?.name;
//           token.role = session.user?.role;
//           token.isTwoFactorEnabled = session.user?.isTwoFactorEnabled;
//           token.isPasswordExist = !!existingUser.password;
//           token.image = session.user?.image;
//         }
//         return token;
//       }

//       // Initial login - generate tokens for first time
//       if (account) {
//         const accessToken = jwt.sign(
//           { userId: user.id },
//           process.env.JWT_SECRET!,
//           {
//             expiresIn: "15m", // Change to longer duration in production (e.g., "15m")
//           },
//         );
//         const refreshToken = jwt.sign(
//           { userId: user.id },
//           process.env.JWT_SECRET!,
//           {
//             expiresIn: "7d", // Change to longer duration in production (e.g., "7d")
//           },
//         );

//         // Set all token properties for new session
//         token.isOAuth = !!existingAccount;
//         token.isPasswordExist = !!existingUser.password;
//         token.name = existingUser.name;
//         token.email = existingUser.email;
//         token.role = existingUser.role;
//         token.image = existingUser.image || "";
//         token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
//         token.accessToken = accessToken;
//         token.refreshToken = refreshToken;
//         token.ATExpireAt = Math.floor(Date.now() / 1000) + 15 * 60; // Change to 15*60 for 15 minutes
//         token.RTExpireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Change to 7*24*60*60 for 7 days

//         return token;
//       }
//       // Access token is still valid - return current token
//       else if (Date.now() < token.ATExpireAt * 1000) {
//         return token;
//       }
//       // Access token expired - attempt refresh using refresh token
//       else {
//         // Early return if refresh token already marked as expired
//         if (token?.error === "RefreshTokenError") return token;

//         if (!token.refreshToken) {
//           throw new TypeError("Missing refresh_token");
//         }

//         try {
//           // Verify refresh token is still valid
//           const decodedRefreshToken = jwt.verify(
//             token.refreshToken,
//             process.env.JWT_SECRET!,
//           ) as any;

//           // Generate new tokens with updated expiration
//           const newAccessToken = jwt.sign(
//             { userId: decodedRefreshToken.userId },
//             process.env.JWT_SECRET!,
//             {
//               expiresIn: "15m", // Change to "15m" in production
//             },
//           );
//           const newRefreshToken = jwt.sign(
//             { userId: decodedRefreshToken.userId },
//             process.env.JWT_SECRET!,
//             {
//               expiresIn: "7d", // Change to "7d" in production
//             },
//           );

//           // Update token with new tokens and expiration times
//           token.accessToken = newAccessToken;
//           token.refreshToken = newRefreshToken;
//           token.ATExpireAt = Math.floor(Date.now() / 1000) + 15 * 60; // Change to 15*60 for 15 minutes
//           token.RTExpireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Change to 7*24*60*60 for 7 days

//           return token;
//         } catch (error) {
//           // Mark token as having refresh token error - will trigger logout
//           console.log("Error refreshing access_token", error);
//           token.error = "RefreshTokenError";
//           return token;
//         }
//       }
//     },
//   },

//   // Auth.js configuration
//   adapter: MongoDBAdapter(clientPromise),
//   session: { strategy: "jwt" },
//   ...authConfig, // Make sure authConfig includes your providers and other settings
// });

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import User from "./models/user";
import { MongoClient } from "mongodb";
import Account from "./models/account";
import { connectMongoDB } from "./lib/mongodb";
import jwt from "jsonwebtoken";
import authConfig from "@/auth.config";

// MongoDB connection setup for Auth.js adapter
const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // Update email verification when user links OAuth account
    async linkAccount({ user }) {
      await connectMongoDB();
      await User.findByIdAndUpdate(user.id, { emailVerified: new Date() });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth providers to skip email verification
      if (account?.provider !== "credentials") return true;

      // OPTIONAL: Add specific checks here (e.g. Email verification, 2FA)
      return true;
    },

    async session({ token, session }) {
      // No DB connection needed here; we read from the cookie/token
      if (token?.error === "RefreshTokenError") {
        return { ...session, error: "RefreshTokenExpired" };
      }

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isPasswordExist = token.isPasswordExist as boolean;
        session.user.accessToken = token.accessToken as string;
        session.user.image = (token.image as string) || "";
      }

      return session;
    },

    async jwt({ token, user, account, trigger, session }) {
      // ----------------------------------------------------------------------
      // SCENARIO 1: Initial Login
      // Fetch fresh data from DB to build the token
      // ----------------------------------------------------------------------
      if (account && user) {
        await connectMongoDB();

        const existingUser = await User.findById(user.id);
        if (!existingUser) return token;

        const existingAccount = await Account.findOne({
          userId: existingUser.id,
        });

        // Generate custom JWTs
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" },
        );

        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" },
        );

        token.isOAuth = !!existingAccount;
        token.isPasswordExist = !!existingUser.password;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.image = existingUser.image || "";
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.ATExpireAt = Math.floor(Date.now() / 1000) + 15 * 60;
        token.RTExpireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

        return token;
      }

      // ----------------------------------------------------------------------
      // SCENARIO 2: Client Side Update (e.g. Profile change)
      // ----------------------------------------------------------------------
      if (trigger === "update" && session) {
        await connectMongoDB();
        const existingUser = await User.findById(token.sub);

        if (session.user) {
          token.email = session.user.email;
          token.name = session.user.name;
          token.role = session.user.role;
          token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
          token.image = session.user.image;

          if (existingUser) {
            token.isPasswordExist = !!existingUser.password;
          }
        }
        return token;
      }

      // ----------------------------------------------------------------------
      // SCENARIO 3: Token is Valid
      // Return immediately to avoid DB hits
      // ----------------------------------------------------------------------
      if (
        token.ATExpireAt &&
        Date.now() < (token.ATExpireAt as number) * 1000
      ) {
        return token;
      }

      // ----------------------------------------------------------------------
      // SCENARIO 4: Refresh Token
      // Access token expired - attempt refresh using refresh token
      // ----------------------------------------------------------------------
      if (token?.error === "RefreshTokenError") return token;

      if (!token.refreshToken) {
        token.error = "RefreshTokenError";
        return token;
      }

      try {
        const decodedRefreshToken = jwt.verify(
          token.refreshToken as string,
          process.env.JWT_SECRET!,
        ) as any;

        const newAccessToken = jwt.sign(
          { userId: decodedRefreshToken.userId },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" },
        );

        const newRefreshToken = jwt.sign(
          { userId: decodedRefreshToken.userId },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" },
        );

        token.accessToken = newAccessToken;
        token.refreshToken = newRefreshToken;
        token.ATExpireAt = Math.floor(Date.now() / 1000) + 15 * 60;
        token.RTExpireAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

        return token;
      } catch (error) {
        console.log("Error refreshing access_token", error);
        token.error = "RefreshTokenError";
        return token;
      }
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  ...authConfig,
});
