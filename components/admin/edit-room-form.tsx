"use client";

import { z } from "zod";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { useTypes, useUpdateRoom } from "@/hooks/use-rooms";
import { NumberField } from "@/components/form-fields/number-field";
import { SelectField } from "@/components/form-fields/select-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { ArrayTextField } from "@/components/form-fields/array-text-field";
import { FileUploadField } from "@/components/form-fields/file-upload-field";

export const EditRoomSchema = z.object({
  id: z.string().readonly(),
  hotelId: z.string().readonly(),
  name: z.string().trim().min(1, "Room name is required"),
  typeId: z.string().min(1, "Room type is required"),
  facilities: z.array(z.string()).min(1, "Facilities are required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  totalUnits: z.coerce.number().min(1, "Total units must be at least 1"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  images: z.array(z.any()).max(5, "Max 5 images").optional(),
});

export type EditRoomForm = z.infer<typeof EditRoomSchema>;

export const EditRoomForm = ({ room }: { room: EditRoomForm }) => {
  const [open, setOpen] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  const { uploadMultiple } = useEdgeStoreUpload();
  const { data: roomTypes, isLoading } = useTypes();
  const { mutateAsync: editRoom } = useUpdateRoom(room.id);

  const form = useFormSchema({
    schema: EditRoomSchema,
    action: handleEditRoom,
    state: room,
    mode: "onChange",
  });

  async function handleEditRoom(data: EditRoomForm) {
    console.log("Preparing to submit edited room:", data);
    const finalImages: { id?: string; url: string }[] = [];

    for (const img of data.images || []) {
      if (img.isNew && img.file) {
        const { files } = await uploadMultiple([img.file]);
        finalImages.push({ url: files[0].url });
      } else if (img.url) {
        finalImages.push({ id: img.id, url: img.url });
      }
    }

    const success = await editRoom({ ...data, images: finalImages });
    if (success) {
      setOpen(false);
      form.reset();
    }
  }

  if (isLoading) return null;

  const handleCancel = () => {
    if (form.isDirty) {
      setConfirmDialog(true);
    } else {
      setOpen(false);
      form.reset();
    }
  };

  const handleClose = () => {
    setConfirmDialog(false);
    setOpen(false);
    form.reset();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel();
          else setOpen(true);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update details and manage room photos below.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] p-2">
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <input
                  type="hidden"
                  {...form.methods.register("id")}
                  value={room.id}
                />
                <input
                  type="hidden"
                  {...form.methods.register("hotelId")}
                  value={room.hotelId}
                />

                <ShortTextField
                  name="name"
                  label="Room Name"
                  placeholder="Enter room name"
                  reset
                />
                <SelectField
                  name="typeId"
                  label="Room Type"
                  options={roomTypes}
                  placeholder="Select room type"
                />
                <LongTextField
                  name="description"
                  label="Description"
                  placeholder="Enter room description"
                  reset
                  rows={4}
                  className="resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NumberField
                    name="totalUnits"
                    label="Total Units"
                    placeholder="e.g., 10"
                  />
                  <NumberField
                    name="price"
                    label="Price per Night"
                    placeholder="e.g., 100"
                  />
                  <NumberField
                    name="capacity"
                    label="Capacity"
                    placeholder="e.g., 2"
                  />
                </div>
                <ArrayTextField
                  name="facilities"
                  label="Facilities"
                  placeholder="e.g., Free WiFi"
                />
                <FileUploadField
                  name="images"
                  label="Room Images"
                  fileType="image"
                  maxSize={5 * 1024 * 1024}
                  maxFiles={5}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.isValid || !form.isDirty || form.isSubmitting
                    }
                  >
                    {form.isSubmitting ? "Updating..." : "Update Room"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to close?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClose}>Yes, Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
