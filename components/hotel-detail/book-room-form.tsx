"use client";

import z from "zod";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate, formatRupiah } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { Room, RoomDetail } from "@/lib/types/rooms";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { FormProvider, useWatch } from "react-hook-form";
import { useBookingWithPayment } from "@/hooks/use-bookings";
import { NumberField } from "@/components/form-fields/number-field";

const BookSchema = z.object({
  roomId: z.string(),
  endDate: z.string().min(1, "End date required"),
  startDate: z.string().min(1, "Start date required"),
  quantity: z.coerce.number().min(1, "At least 1 room must be booked"),
});

export type BookForm = z.infer<typeof BookSchema>;

export const BookRoomForm = ({
  room,
  bookForm,
}: {
  room: RoomDetail;
  bookForm: BookForm;
}) => {
  const router = useRouter();
  const { mutateAsync: bookRoom, isPending } = useBookingWithPayment();

  const form = useFormSchema({
    schema: BookSchema,
    state: bookForm,
    action: handleBookRoom,
    mode: "onChange",
  });

  // 🔹 Watch quantity agar total update real-time
  const quantity = useWatch({
    control: form.methods.control,
    name: "quantity",
  });

  // 🔹 Hitung durasi menginap (dalam hari)
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(bookForm.endDate).getTime() -
        new Date(bookForm.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const total = room.price * nights * (quantity || 1);

  async function handleBookRoom(data: BookForm) {
    if (data.quantity > room.availableUnits) {
      toast.error(`Hanya ${room.availableUnits} kamar tersisa`);
      return;
    }

    const result = await bookRoom(data);

    if (result.success) {
      toast.success(result.message);
      window.location.href = result.data.redirectUrl;
    } else {
      router.push("/signin");
      toast.info("Silakan masuk untuk melanjutkan pemesanan");
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) form.reset(bookForm);
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full rounded-xl bg-teal-500 hover:bg-teal-600"
          disabled={isPending}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Pesan Sekarang
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-0">
          <DialogTitle>Form Pemesanan Kamar</DialogTitle>
          <DialogDescription>
            Pilih jumlah kamar yang kamu butuhkan
          </DialogDescription>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-blue-500">
              Check-in: {formatDate(bookForm.startDate)}
            </Badge>
            <span>•</span>
            <Badge className="bg-blue-500">
              Check-out: {formatDate(bookForm.endDate)}
            </Badge>
          </div>
        </DialogHeader>

        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-6">
            {/* Jumlah kamar */}
            <NumberField
              name="quantity"
              placeholder="Number of room"
              min={1}
              max={room.availableUnits}
              className="h-14"
              helperText={`tersedia: ${room.availableUnits} kamar`}
            />

            {/* 🔹 Total Bayar Section */}
            <div className="p-4 bg-slate-100 rounded-xl flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                {nights} malam × {quantity || 1} kamar ×{" "}
                {formatRupiah(room.price)} / malam
              </div>
              <div className="text-lg font-bold text-emerald-600">
                Total: {formatRupiah(total)}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl h-12 bg-teal-500 hover:bg-teal-600"
              disabled={isPending || !form.isValid}
            >
              {isPending ? "Memesan..." : "Pesan Sekarang"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
