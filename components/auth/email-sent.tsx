import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MailCheck } from "lucide-react";

export function EmailSent({ form }: { form: any }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:80px_80px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial mask overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] dark:bg-black"></div>

      {/* Card */}
      <Card className="relative z-20 w-full max-w-md border border-border/40 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-lg shadow-xl">
        <CardHeader className="text-center space-y-2">
          <MailCheck className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
          <CardTitle className="text-2xl font-bold tracking-tight">
            Cek inbox email kamu
            {/* Check your email */}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Kami telah mengirim magic link untuk melanjutkan
            {/* We’ve sent you a magic link to continue */}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Link aktivasi telah dikirimkan ke
            {/* A magic link was sent to{" "} */}
            <span className="font-medium text-foreground">
              {form.methods.getValues("email")}
            </span>
            .<br />
            Harap cek inbox dan lanjutkan klik link
            {/* Please check your inbox and follow the link. */}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
