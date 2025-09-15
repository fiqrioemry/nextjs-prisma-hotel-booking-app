"use client";

import z, { set } from "zod";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateRoom, useTypes } from "@/hooks/use-rooms";
import { NumberField } from "@/components/form-fields/number-field";
import { SelectField } from "@/components/form-fields/select-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { ArrayTextField } from "@/components/form-fields/array-text-field";
import { FileUploadField } from "@/components/form-fields/file-upload-field";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";

export const RoomSchema = z.object({
  hotelId: z.string().readonly(),
  typeId: z.string().min(1, "Room type is required"),
  name: z.string().trim().min(1, "Room name is required"),
  facilities: z.array(z.string()).min(1, "Facilities is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  totalUnits: z.coerce.number().min(1, "Total units must be at least 1"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  images: z.array(z.any()).max(5, "Max 5 images").optional(),
});

export type AddRoomForm = z.infer<typeof RoomSchema>;

export const AddRoomForm = ({ id }: { id: string }) => {
  const [open, setOpen] = React.useState(false);
  const { uploadMultiple } = useEdgeStoreUpload();
  const { data: roomTypes, isLoading } = useTypes();
  const { mutateAsync: createRoom } = useCreateRoom();
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  //   initialize react hook form with zod schema
  const form = useFormSchema({
    schema: RoomSchema,
    action: handleAddRoom,
    state: {
      id,
      name: "",
      typeId: "",
      description: "",
      totalUnits: 1,
      price: 0,
      capacity: 1,
      facilities: [],
      images: [],
      uploadedImages: [],
    },
    mode: "onChange",
  });

  //   hooks function to add new room
  async function handleAddRoom(data: AddRoomForm) {
    if (data.images && data.images.length > 0) {
      const filesToUpload = data.images.map((img: any) =>
        img instanceof File ? img : img.file
      );

      const result = await uploadMultiple(filesToUpload);
      data.images = result.files; // [{ url, name, size, type }]
    }

    const success = await createRoom(data);
    if (success) {
      setOpen(false);
      form.reset();
    }
  }
  //   wait for roomType to load
  if (isLoading) return null;

  // handle close dialog with unsaved changes confirmation
  const handleClose = () => {
    if (form.isDirty) {
      setConfirmDialog(true);
    } else {
      setOpen(!open);
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleClose()}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Room
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new room.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] p-2">
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <input
                  type="hidden"
                  {...form.methods.register("hotelId")}
                  value={id}
                />
                {/* Form fields go here */}
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
                  fileType="image"
                  label="Room Images"
                  maxSize={1 * 1024 * 1024}
                  maxFiles={5}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button
                    type="button"
                    disabled={form.isSubmitting}
                    onClick={() => handleClose()}
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.isValid || !form.isDirty || form.isSubmitting
                    }
                  >
                    {form.isSubmitting ? "Adding..." : "Add Room"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialog} onOpenChange={() => setConfirmDialog(false)}>
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
            <Button
              onClick={() => {
                setConfirmDialog(false);
                setOpen(false);
                form.reset();
              }}
            >
              Yes, Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
