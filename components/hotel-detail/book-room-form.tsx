"use client";

import z from "zod";

import {
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/actions/hotels";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useBookingWithPayment } from "@/hooks/use-bookings";
import { NumberField } from "@/components/form-fields//number-field";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

const BookSchema = z.object({
  roomId: z.string(),
  endDate: z.string().min(1, "End date required"),
  startDate: z.string().min(1, "Start date required"),
  quantity: z.coerce.number().min(1, "At least 1 room must be booked"),
});

export type BookForm = z.infer<typeof BookSchema>;

export const BookRoomForm = ({
  startDate,
  endDate,
  room,
  bookForm,
}: {
  hotelId: string;
  startDate: string;
  endDate: string;
  room: Room;
  bookForm: BookForm;
}) => {
  const { mutateAsync: bookRoom, isPending } = useBookingWithPayment();

  const form = useFormSchema({
    schema: BookSchema,
    state: bookForm,
    action: handleBookRoom,
    mode: "onChange",
  });

  async function handleBookRoom(data: BookForm) {
    const result = await bookRoom(data);
    console.log(result);
    if (result.success) {
      toast.success(result.message);
      window.location.href = result.data.redirectUrl;
    } else {
      console.log(result.message);
    }
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) form.reset(bookForm);
        }}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="w-full" disabled={isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Book Now
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="mb-0">
            <DialogTitle>Book Room Form</DialogTitle>
            <DialogDescription>
              Select the number of rooms you want to book
            </DialogDescription>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-blue-500">
                Check-in: {formatDate(startDate)}
              </Badge>
              <span>•</span>
              <Badge className="bg-blue-500">
                Check-out: {formatDate(endDate)}
              </Badge>
            </div>
          </DialogHeader>

          <FormProvider {...form.methods}>
            <form onSubmit={form.handleSubmit} className="space-y-6">
              <NumberField
                name="quantity"
                placeholder="Number of room"
                min={1}
                max={room.availableUnits}
                helperText={`Available: ${room.availableUnits} rooms`}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !form.isValid}
              >
                {isPending ? "Creating Booking..." : "Create Booking"}
              </Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
};
