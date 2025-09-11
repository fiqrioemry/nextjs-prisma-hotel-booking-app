"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FormProvider } from "react-hook-form";
import { Icons } from "@/components/auth/icons";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { SignInSocial } from "@/components/auth/signin-social";
import { EmailField } from "@/components/form-fields/email-field";
import { ArrowRight, Loader2, Mail, AlertCircle } from "lucide-react";
import { PasswordField } from "@/components/form-fields/password-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SignUpSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type SignUpForm = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const [pending, setPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const form = useFormSchema({
    action: handleSignUp,
    schema: SignUpSchema,
    mode: "onChange",
  });

  async function handleSignUp(data: SignUpForm) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      data.name
    )}&background=random&color=fff`;

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        image: avatarUrl,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          setSentTo(data.email);
          setEmailSent(true);
          toast.success(
            "Account created successfully! Verification email sent."
          );
          form.reset();
        },
        onError: (ctx) => {
          console.log("error", ctx);
          setError(ctx.error.message || "Something went wrong!");
        },
      }
    );

    setPending(false);
  }

  return (
    <Card className="max-w-md w-full z-20 bg-card border-none shadow-lg font-mono">
      {!emailSent ? (
        <>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>

            <div className="flex items-center gap-2 flex-col w-full">
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
                <ShortTextField
                  name="name"
                  label="Full name"
                  placeholder="eq. John Doe"
                  reset
                />
                <EmailField
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  reset
                />
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  reset
                />
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={pending || !form.isValid || !form.isDirty}
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Sign up <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="space-y-2">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verify your email
            </CardTitle>
            <CardDescription className="text-center">
              We have sent a verification link to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center font-medium">{sentTo}</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Please check your inbox and click the verification link to
              activate your account.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn’t get the email? Check your spam folder.
            </p>
            <Link
              href="/signin"
              className="text-primary font-medium text-sm hover:underline"
            >
              Back to Sign In
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
