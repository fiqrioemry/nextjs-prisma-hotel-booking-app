// app/(auth)/signin/page.tsx
"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useFormSchema } from "@/hooks/use-form-schema";
import { EmailField } from "@/components/form-fields/email-field";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/auth/icons";
import { SignInSocial } from "@/components/auth/signin-social";
import { EmailSent } from "@/components/auth/email-sent";

const signInSchema = z.object({
  email: z.string().email("Email is not valid"),
});

type SignInData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const redirectUrl = searchParams.get("redirect") || "/profile";

  // use form hook initialization
  const form = useFormSchema({
    schema: signInSchema,
    action: handleSignIn,
    mode: "onChange",
  });

  async function handleSignIn(data: SignInData) {
    setLoading(true);
    try {
      await authClient.sendVerificationEmail({ email: data.email });
      setEmailSent(true);
    } catch (error) {
      console.error("Magic link error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return <EmailSent form={form} />;
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:80px_80px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl"></p>
      <Card className="max-w-sm w-full shadow-none backdrop-blur-xl">
        <CardContent className="space-y-4">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Signin to continue manage your finance
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col space-y-4 mb-4">
            <SignInSocial provider="google" redirectUrl={redirectUrl}>
              <Icons.google />
              <div> Sign in with Google</div>
            </SignInSocial>
            <SignInSocial provider="github" redirectUrl={redirectUrl}>
              <Icons.gitHub />
              <span> Sign in with Google</span>
            </SignInSocial>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Or continue with
          </div>

          <FormProvider {...form.methods}>
            <form onSubmit={form.handleSubmit} className="space-y-2 ">
              <EmailField name="email" placeholder="Enter your email" />
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={!form.isValid || loading}
              >
                {loading ? "Sending magic link..." : "Sign In with email"}
              </Button>
            </form>
          </FormProvider>
          <div className="text-center text-sm text-muted-foreground">
            Return to homepage{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
