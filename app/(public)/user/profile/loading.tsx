import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User2, Mail, Calendar } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full max-w-5xl mx-auto w-full space-y-8">
      <Card className="p-0 ">
        <CardHeader className="pt-4">
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Manage your account settings and personal information
          </CardDescription>

          {/* READ-ONLY SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl border mt-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-3 w-32" />
            </div>

            {/* Joined At */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </label>
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </CardHeader>

        {/* EDITABLE FORM */}
        <CardContent className="space-y-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>

          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
