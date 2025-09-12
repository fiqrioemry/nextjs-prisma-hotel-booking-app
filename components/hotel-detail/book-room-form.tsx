"use client";

import z from "zod";

import {
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useBookingWithPayment } from "@/hooks/use-bookings";
import { NumberField } from "@/components/form-fields//number-field";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import type { Room } from "@/lib/actions/hotels";

const bookSchema = z.object({
  hotelId: z.string(),
  roomId: z.string(),
  endDate: z.string().min(1, "End date required"),
  startDate: z.string().min(1, "Start date required"),
  numberOfRooms: z.coerce.number().min(1, "At least 1 room must be booked"),
});

export type bookForm = z.infer<typeof bookSchema>;

export const BookRoomForm = ({
  room,
  bookForm,
}: {
  room: Room;
  bookForm: bookForm;
}) => {
  const { mutateAsync: bookRoom, isPending } = useBookingWithPayment();

  const form = useFormSchema({
    schema: bookSchema,
    state: bookForm,
    action: handleBookRoom,
    mode: "onChange",
  });

  async function handleBookRoom(data: bookForm) {}

  return (
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
        </DialogHeader>

        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-6">
            <NumberField
              name="totalUnits"
              placeholder="Number of room"
              min={1}
              max={room.availableUnits}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !form.isValid}
            >
              {isPending ? "Transaction in progress..." : "Top Up"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
