import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { verifyResetToken } from "@/lib/actions/auth";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  const isValid = token ? await verifyResetToken(token) : false;

  if (!isValid) {
    return (
      <Card className="max-w-md w-full z-20 bg-card shadow-lg py-12">
        <CardHeader>
          <AlertCircle className="mx-auto h-14 w-14 text-destructive" />
          <CardTitle className="text-center text-destructive text-2xl">
            Invalid Token
          </CardTitle>
          <CardDescription className="text-center">
            The password reset link is invalid or has expired.
          </CardDescription>
          <div className="text-sm text-center text-muted-foreground mt-2 space-x-2">
            please request another reset link
            <Link
              href="/forgot-password"
              className="ml-2 font-medium text-primary underline-offset-4 hover:underline"
            >
              here
            </Link>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return <ResetPasswordForm token={token!} />;
}
