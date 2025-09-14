"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ErrorMessageBox } from "@/components/shared/response-message";
import { SubmitButton } from "@/components/form-control/submit-button";
import { PasswordField } from "@/components/form-fields/password-field";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useFormSchema({
    action: handleResetPassword,
    schema: ResetPasswordSchema,
    mode: "onChange",
  });

  async function handleResetPassword(data: ResetPasswordForm) {
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (error) {
      setError(error.message || "Failed to reset password");
      toast.error(error.message || "Failed to reset password");
    } else {
      toast.success("Password reset successfully, please login");
      router.push("/signin");
    }
  }

  return (
    <Card className="max-w-md w-full shadow bg-card z-20">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <ErrorMessageBox message={error} />}
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-3">
            <PasswordField
              name="password"
              placeholder="Enter new password"
              label="New Password"
              reset
            />
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm new password"
              label="Confirm Password"
              reset
            />
            <div className="mt-4">
              <SubmitButton
                text="Update Password"
                isLoading={form.isSubmitting}
                disabled={!form.isValid || form.isSubmitting}
              />
            </div>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
