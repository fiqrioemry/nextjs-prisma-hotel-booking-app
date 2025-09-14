"use client";

import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { DateField } from "@/components/form-fields/date-field";
import { SubmitButton } from "@/components/form-control/submit-button";

const DateSchema = z.object({
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
});

export type DateForm = z.infer<typeof DateSchema>;

type SelectDateFormProps = {
  open: boolean;
  onOpenChange: (data: DateForm) => Promise<void>;
};

export const SelectDateForm = ({ open, onOpenChange }: SelectDateFormProps) => {
  const today = new Date();
  const defaultStart = today.toISOString().split("T")[0];
  const defaultEnd = new Date(today.getTime() + 86400000)
    .toISOString()
    .split("T")[0];

  const defaultState = {
    startDate: defaultStart,
    endDate: defaultEnd,
  };

  const form = useFormSchema({
    schema: DateSchema,
    action: onOpenChange,
    state: defaultState,
    mode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(defaultState)}>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Select Your Stay Dates</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            To see hotel availability, please choose your check-in and check-out
            dates.
            <br />
            If you close this form, we’ll use today and tomorrow as the default
            dates.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form.methods}>
          <form
            onSubmit={form.handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            <DateField name="startDate" label="Check-in" />
            <DateField name="endDate" label="Check-out" />

            <div className="md:col-span-2">
              <SubmitButton
                text="Search Hotels"
                isLoading={form.isSubmitting}
                disabled={!form.isValid || form.isSubmitting}
                className="w-full h-12 text-lg font-semibold"
              />
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
