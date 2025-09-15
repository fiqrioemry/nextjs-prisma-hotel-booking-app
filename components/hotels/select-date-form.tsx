"use client";

import z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";
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
  initialValues?: DateForm;
  onOpenChange: (data: DateForm) => Promise<void>;
};

export const SelectDateForm = ({
  open,
  onOpenChange,
  initialValues,
}: SelectDateFormProps) => {
  const today = new Date();
  const fallbackStart = today.toISOString().split("T")[0];
  const fallbackEnd = new Date(today.getTime() + 86400000)
    .toISOString()
    .split("T")[0];

  const defaultState = initialValues ?? {
    startDate: fallbackStart,
    endDate: fallbackEnd,
  };

  const form = useFormSchema({
    schema: DateSchema,
    action: onOpenChange,
    state: defaultState,
    mode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(defaultState)}>
      <DialogContent className="sm:max-w-2xl w-full rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-md">
        {/* Enhanced Dialog Header */}
        <DialogHeader className="space-y-6 pb-6">
          {/* Icon and badge */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          {/* Title with enhanced styling */}
          <DialogTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
            Pilih Tanggal Menginap {/* Select Your Stay Dates */}
          </DialogTitle>

          {/* Enhanced description */}
          <DialogDescription className="text-center space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Untuk melihat ketersediaan hotel, silakan pilih tanggal check-in
              dan check-out Anda
              {/* To see hotel availability, please choose your check-in and check-out dates */}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4" />
              <span>
                Jika Anda menutup form ini, kami akan menggunakan hari ini dan
                besok sebagai tanggal default
                {/* If you close this form, we'll use today and tomorrow as the default dates */}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Enhanced Form Section */}
        <div className="space-y-6">
          <FormProvider {...form.methods}>
            <form onSubmit={form.handleSubmit} className="space-y-6">
              {/* Date fields with enhanced layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs">📅</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Tanggal Check-in {/* Check-in Date */}
                    </span>
                  </div>
                  <DateField
                    name="startDate"
                    label=""
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs">📅</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Tanggal Check-out {/* Check-out Date */}
                    </span>
                  </div>
                  <DateField
                    name="endDate"
                    label=""
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Enhanced submit button */}
              <div className="pt-4">
                <SubmitButton
                  text={
                    form.isSubmitting ? "Mencari Hotel..." : "🔍 Cari Hotel"
                  }
                  isLoading={form.isSubmitting}
                  disabled={!form.isValid || form.isSubmitting}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
                />
              </div>
            </form>
          </FormProvider>

          {/* Additional help section */}
          <div className="border-t pt-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-800 text-sm">
                    Tips Pemesanan {/* Booking Tips */}
                  </h4>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Pesan minimal 1 hari sebelumnya untuk mendapatkan pilihan
                    kamar terbaik dan harga yang lebih menarik
                    {/* Book at least 1 day in advance to get the best room selection and better prices */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
