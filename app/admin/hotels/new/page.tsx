"use client";
import React from "react";

import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locationOptions } from "@/lib/constant";
import { useFormSchema } from "@/hooks/use-form-schema";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { FormProvider, useFieldArray } from "react-hook-form";
import { FileUpload } from "@/components/form-fields/file-upload";
import { NumberField } from "@/components/form-fields/number-field";
import { SelectField } from "@/components/form-fields/select-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { ArrayTextField } from "@/components/form-fields/array-text-field";
import {
  FolderDown,
  Hotel,
  Info,
  Loader2,
  Plus,
  PlusCircle,
  Trash2,
} from "lucide-react";

// ---------------- SCHEMA ----------------
const RoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  price: z.coerce.number().min(1000, "Price must be at least 1000"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  description: z.string().min(1, "Description is required"),
  totalUnits: z.coerce.number().min(1, "Total units must be at least 1"),
  facilities: z.array(z.string()).min(1, "Facilities is required"),
  images: z.array(z.instanceof(File)).optional(),
});

const HotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  address: z.string().min(1, "Address is required"),
  rooms: z.array(RoomSchema).min(1, "At least one room is required"),
});

export type RoomForm = z.infer<typeof RoomSchema>;
export type HotelForm = z.infer<typeof HotelSchema>;

// ---------------- PAGE ----------------
export default function Page() {
  const { uploadMultiple } = useEdgeStoreUpload();

  const form = useFormSchema({
    schema: HotelSchema,
    action: handleAddHotel,
    mode: "onChange",
    state: { rooms: [] },
  });

  const { control } = form.methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rooms",
  });

  async function handleAddHotel(data: HotelForm) {
    // // upload images for each room
    // const processedRooms = await Promise.all(
    //   data.rooms.map(async (room) => {
    //     const uploaded = room.images?.length
    //       ? await uploadMultiple(room.images)
    //       : { files: [] };
    //     return { ...room, images: uploaded.files };
    //   })
    // );

    // const payload = {
    //   ...data,
    //   rooms: processedRooms,
    // };

    console.log("Hotel Payload:", data);
    // TODO: post to API
  }

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Hotel className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold  mb-2">Add New Hotel</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a comprehensive listing for your hotel with detailed
              information about rooms, amenities, and facilities to attract
              guests.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-8">
            {/* Progress Indicator */}
            <div className="rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="font-medium">Hotel Information</span>
                </div>
                <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
                  <div
                    className="h-1 bg-blue-600 rounded"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="font-medium text-gray-500">
                    Room Details
                  </span>
                </div>
              </div>
            </div>

            {/* HOTEL INFO SECTION */}
            <div className="space-y-6">
              <div className="rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        Basic Hotel Information
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Enter the fundamental details about your hotel property
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <ShortTextField
                        name="name"
                        label="Hotel Name"
                        placeholder="Enter hotel name"
                        reset
                      />
                    </div>

                    <div className="md:col-span-2">
                      <LongTextField
                        name="description"
                        label="Hotel Description"
                        rows={4}
                        className="resize-none"
                        reset
                      />
                    </div>

                    <SelectField
                      name="location"
                      label="Location"
                      placeholder="Select location"
                      options={locationOptions}
                    />

                    <ShortTextField
                      name="thumbnail"
                      label="Hotel Thumbnail URL"
                      placeholder="https://example.com/hotel-image.jpg"
                      reset
                    />

                    <div className="md:col-span-2">
                      <ShortTextField
                        name="address"
                        label="Complete Address"
                        placeholder="Enter detailed hotel address"
                        reset
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROOMS SECTION */}
            <div className="space-y-6">
              <div className="rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <FolderDown />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          Room Configuration
                        </h2>
                        <p className="text-emerald-100 text-sm">
                          Add and configure different room types and their
                          amenities
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        append({
                          type: "",
                          price: 0,
                          capacity: 0,
                          description: "",
                          name: "",
                          totalUnits: 0,
                          facilities: [],
                          images: [],
                        })
                      }
                      className="text-emerald-600 hover:bg-emerald-50 border-0 shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Room
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {fields.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderDown className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No rooms added yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Start by adding your first room type to continue
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 grid ">
                      {fields.map((field, idx) => (
                        <Card
                          key={field.id}
                          className="border-2 transition-all duration-200"
                        >
                          <div className="bg-white px-6 py-4 border-b">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {idx + 1}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    Room {idx + 1}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Configure room details and amenities
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                type="button"
                                variant="destructive"
                                onClick={() => remove(idx)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          <div className="px-6 space-y-6 grid grid-cols-2 gap-4">
                            <div className="space-y-6 col-span-1">
                              {/* Basic Room Info */}

                              <ShortTextField
                                name={`rooms.${idx}.name`}
                                label="Room Name"
                                placeholder="e.g., Deluxe Ocean View Suite"
                                reset
                              />
                              <ShortTextField
                                name={`rooms.${idx}.type`}
                                label="Room Type"
                                placeholder="e.g., Suite, Standard, Deluxe"
                                reset
                              />

                              {/* Pricing and Capacity */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <NumberField
                                  name={`rooms.${idx}.price`}
                                  label="Price per Night"
                                  min={1000}
                                  step={1000}
                                  placeholder="Enter price"
                                />
                                <NumberField
                                  name={`rooms.${idx}.capacity`}
                                  label="Guest Capacity"
                                  min={1}
                                  step={1}
                                  placeholder="Max guests"
                                />
                                <NumberField
                                  name={`rooms.${idx}.totalUnits`}
                                  label="Available Units"
                                  min={1}
                                  step={1}
                                  placeholder="Number of rooms"
                                />
                              </div>

                              {/* Facilities */}
                              <div>
                                <ArrayTextField
                                  name={`rooms.${idx}.facilities`}
                                  label="Room Facilities & Amenities"
                                  placeholder="Type a facility (e.g., WiFi, AC, TV) and press Enter"
                                  helperText="Add amenities one by one - press Enter after each item"
                                />
                              </div>

                              {/* Description */}
                              <div>
                                <LongTextField
                                  name={`rooms.${idx}.description`}
                                  label="Room Description"
                                  rows={5}
                                  className="resize-none h-72"
                                />
                              </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                              <FileUpload
                                name={`rooms.${idx}.images`}
                                mode="preview"
                                label="Room Images"
                                fileType="image"
                                multiple={true}
                                maxFiles={5}
                                maxSize={5 * 1024 * 1024}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SUBMIT SECTION */}
            <div className="bg-card rounded-lg shadow-sm border  p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold ">
                    Ready to Create Hotel?
                  </h3>
                  <p className="text-muted-foreground">
                    Review your information and submit to add the hotel
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Hotel Info: ✓</div>
                  <div>Rooms: {fields.length} added</div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold  shadow-lg"
                // disabled={!form.isValid || !form.isDirty}
              >
                {form.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Hotel...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Hotel
                  </div>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
