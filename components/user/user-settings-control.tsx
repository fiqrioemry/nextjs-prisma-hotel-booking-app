"use client";

import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Settings } from "lucide-react";

export const UserSettingsControl = () => {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-8 w-8" />
          User Settinggs
        </CardTitle>
        <CardDescription>
          Manage your account settings and profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-4 h-96 flex items-center justify-center border-t">
        <div>User Settings Control Component</div>
      </CardContent>
    </Card>
  );
};
