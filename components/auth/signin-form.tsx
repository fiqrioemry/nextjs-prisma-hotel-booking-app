"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { EmailField } from "@/components/form-fields/email-field";
import { SubmitButton } from "@/components/form-control/submit-button";
import { PasswordField } from "@/components/form-fields/password-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";

import z from "zod";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Icons } from "@/components/auth/icons";
import { useSearchParams } from "next/navigation";
import { SignInSocial } from "@/components/auth/signin-social";
import Link from "next/link";

const SignInSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const params = useSearchParams();
  const redirectUrl = params.get("redirect") || "/";
  const [error, setError] = useState<string | null>(null);

  //   initialize react hook form
  const form = useFormSchema({
    action: handleSignIn,
    schema: SignInSchema,
    mode: "onChange",
  });

  //  handle signin function
  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: redirectUrl,
      },
      {
        onSuccess: (ctx) => {
          toast.success("Successfully signed in!");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Something went wrong!");
        },
      }
    );
  }

  return (
    <Card className="max-w-md w-full shadow bg-card z-20 font-mono">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please enter your email and password to sign in.
        </CardDescription>
        <div className="flex items-center gap-2 flex-col">
          <SignInSocial redirectUrl="/" provider="google">
            <Icons.google />
            <div>Sign in with Google</div>
          </SignInSocial>
          <SignInSocial redirectUrl="/" provider="github">
            <Icons.gitHub />
            <div>Sign in with GitHub</div>
          </SignInSocial>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          or continue with
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="flex items-center bg-destructive/10 border-destructive text-destructive mb-4">
            <AlertCircle className="h-6 w-6" />
            <div className="flex-1">
              <AlertTitle>Sign In Failed</AlertTitle>
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </div>
          </Alert>
        )}
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-2">
            <EmailField name="email" placeholder="enter your email" reset />
            <PasswordField
              name="password"
              placeholder="enter your password"
              reset
            />
            <div>
              <Link
                className="text-sm flex items-end justify-end underline hover:font-semibold"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-4">
              <SubmitButton
                text="Sign In"
                isLoading={form.isSubmitting}
                disabled={!form.isValid || form.isSubmitting || !form.isDirty}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Dont have an account ?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
        <div className="text-sm">
          back to
          <Link
            href="/"
            className="ml-2  text-primary underline-offset-4 hover:underline"
          >
            home
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
