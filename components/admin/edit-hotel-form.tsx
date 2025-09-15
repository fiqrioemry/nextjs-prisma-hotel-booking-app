"use client";

import z from "zod";
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
import { useUpdateHotel } from "@/hooks/use-hotels";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { FileUploadField } from "@/components/form-fields/file-upload-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";

export const EditHotelSchema = z.object({
  id: z.string().readonly(),
  name: z.string().trim().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  address: z.string().trim().min(10, "Address must be at least 10 characters"),
  thumbnail: z
    .array(z.any())
    .max(1, "Only 1 thumbnail image is allowed")
    .optional(),
});

export type EditHotelForm = z.infer<typeof EditHotelSchema>;

export const EditHotelForm = ({ hotel }: { hotel: EditHotelForm }) => {
  const [open, setOpen] = React.useState(false);
  const { uploadSingle } = useEdgeStoreUpload();
  const { mutateAsync: editHotel } = useUpdateHotel(hotel.id);
  const [confirmDialog, setConfirmDialog] = React.useState(false);

  //   initialize react hook form with zod schema
  const form = useFormSchema({
    schema: EditHotelSchema,
    action: handleEditHotel,
    state: hotel,
    mode: "onChange",
  });

  //   hooks function to add new hotel
  async function handleEditHotel(data: EditHotelForm) {
    let thumbnailUrl = hotel.thumbnail as any;

    if (data.thumbnail instanceof File) {
      const result = await uploadSingle(data.thumbnail);
      thumbnailUrl = result.url;
    }

    await editHotel({
      ...data,
      thumbnail: thumbnailUrl, // simpan url ke DB
    });

    setOpen(false);
    form.reset();
  }

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
          <Button variant="secondary">
            <span>Edit Hotel</span>
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New hotel</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new hotel.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] p-2">
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <input
                  type="hidden"
                  {...form.methods.register("id")}
                  value={hotel.id}
                />

                {/* Form fields go here */}
                <ShortTextField
                  name="name"
                  label="hotel Name"
                  placeholder="Enter hotel name"
                  reset
                />

                <LongTextField
                  name="description"
                  label="Description"
                  placeholder="Enter hotel description"
                  reset
                  rows={4}
                  className="resize-none"
                />
                <LongTextField
                  name="address"
                  label="Address"
                  placeholder="Enter hotel address"
                  reset
                  rows={3}
                  className="resize-none"
                />

                <FileUploadField
                  name="thumbnail"
                  label="Thumbnail Image"
                  fileType="image"
                  maxSize={1 * 1024 * 1024}
                  maxFiles={1}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Button>
                    <span onClick={() => handleClose()}>Cancel</span>
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.isValid || !form.isDirty || form.isSubmitting
                    }
                  >
                    {form.isSubmitting ? "Updating..." : "Update hotel"}
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
