import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Hotels } from "@/lib/types/hotels";
import { Button } from "@/components/ui/button";

export const DeleteHotelForm = ({ hotel }: { hotel: Hotels }) => {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    toast.info("Delete hotel feature is disabled on DEMO.");
    console.log("call api to delete hotel");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start"
        >
          <Trash className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Hotel</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the hotel "{hotel.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
