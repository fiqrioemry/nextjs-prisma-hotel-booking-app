"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { z } from "zod";
import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { updateMyProfile } from "@/lib/actions/my";
import { useFormSchema } from "@/hooks/use-form-schema";
import { SelectField } from "@/components/form-fields/select-field";
import { X, Check, Loader2, Mail, Calendar, User2 } from "lucide-react";
import { PhoneNumberField } from "@/components/form-fields/phone-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";

const ProfileSchema = z.object({
  name: z.string().trim().min(3, "Name required min. 3 characters"),
  email: z.string().readonly(),
  bio: z.string().max(160).optional(),
  address: z.string().max(255).optional(),
  phone: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE"]).optional().nullable(),
  image: z.string().url("Invalid image URL").nullable().optional(),
  joinedAt: z.string().readonly(),
});

export type ProfileForm = z.infer<typeof ProfileSchema>;

export const UserProfileForm = ({ profile }: { profile: ProfileForm }) => {
  const form = useFormSchema({
    schema: ProfileSchema,
    state: profile,
    mode: "onChange",
    action: handleUpdateProfile,
  });

  async function handleUpdateProfile(data: ProfileForm) {
    try {
      const res = await updateMyProfile(data);
      if (!res.success) console.log(res.message);
      toast.success("Profile updated successfully");
      form.reset(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <Card className="p-0">
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <User2 className="h-8 w-8" />
          User Profile
        </CardTitle>
        <CardDescription>
          Manage your account settings and personal information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-4 border-t">
        {/* Read only section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl border">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border shadow-sm">
              <Image
                src={profile.image || "https://placehold.co/100x100"}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 font-medium">{profile.name}</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <div className="px-3 py-2 border rounded-lg text-muted-foreground shadow-sm">
              {profile.email}
            </div>
            <p className="text-xs text-muted-foreground/50">
              Your email address cannot be changed
            </p>
          </div>

          {/* Joined At */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member Since
            </label>
            <div className="px-3 py-2 border rounded-lg text-muted-foreground shadow-sm">
              {formatDateTime(new Date(profile.joinedAt))}
            </div>
            <p className="text-xs text-muted-foreground/50">
              Account creation date
            </p>
          </div>
        </div>
        {/* Editable form */}
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShortTextField
                name="name"
                label="Full Name"
                placeholder="Enter your name"
              />
              <PhoneNumberField
                name="phone"
                label="Phone"
                placeholder="Enter your phone number"
              />
            </div>

            <SelectField
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
              ]}
            />

            <LongTextField
              name="bio"
              label="Bio"
              rows={3}
              placeholder="Tell us about yourself"
              className="resize-none"
            />

            <ShortTextField
              name="address"
              label="Address"
              placeholder="Enter your address"
            />

            {/* ACTIONS: show only if dirty + valid */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                form.isDirty && form.isValid
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  You have unsaved changes
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={form.isSubmitting}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.isSubmitting}>
                    {form.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span> Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span> Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
