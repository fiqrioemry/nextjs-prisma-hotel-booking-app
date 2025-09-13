// lib/auth.ts
import { db } from "./prisma";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendResetLink, sendVerificationLink } from "./mailer";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ password, hash }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetLink({
        to: user.email,
        subject: "Reset your password",
        url: url,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.NEXT_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  secret: process.env.NEXT_BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/auth/verify-email?token=${token}&callbackURL=${process.env
        .NEXT_VERIFICATION_URL!}`;
      await sendVerificationLink({
        to: user.email,
        subject: "Verify your email address",
        url: verificationUrl,
      });
    },
  },
  plugins: [nextCookies()],
  cookies: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain:
      process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, _) => {
          try {
            await db.profile.create({
              data: {
                userId: user.id,
              },
            });

            // add function to create new record on specific table when new user is created
            console.log(`Profile created for user: ${user.id}`);
          } catch (error) {
            console.error("Error creating profile:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = (typeof auth.$Infer.Session)["user"];
