"use client";

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";

type TriggerType = "normal" | "icon" | "pill" | "mini";

interface DialogConfirmProps {
  // Content props
  title?: string;
  description?: string;

  // Button text customization
  triggerButtonText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;

  // Styling props
  confirmButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  // Custom trigger element (optional)
  triggerElement?: ReactNode;

  // Trigger type
  triggerType?: TriggerType;

  // Behavior props
  loading?: boolean;
  disabled?: boolean;

  // Actions
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export function DialogConfirm({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  triggerButtonText = "Delete",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "destructive",
  triggerElement,
  triggerType = "normal",
  loading = false,
  disabled = false,
  onConfirm,
  onCancel,
}: DialogConfirmProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    onCancel?.();
  }, [onCancel]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isLoading) {
        setIsOpen(false);
      } else if (open) {
        setIsOpen(true);
      }
    },
    [isLoading]
  );

  // === Trigger Variants ===
  const getTrigger = () => {
    if (triggerElement) return triggerElement;

    switch (triggerType) {
      case "mini":
        return (
          <button>
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        );
      case "icon":
        return (
          <Button size="icon" disabled={disabled}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        );
      case "pill":
        return (
          <Button
            variant="destructive"
            className="h-8 w-full"
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            {triggerButtonText}
          </Button>
        );
      case "normal":
      default:
        return (
          <Button variant="destructive" disabled={disabled}>
            {triggerButtonText}
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{getTrigger()}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="mx-auto animate-spin mb-2" size={40} />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>

              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>

              {description && (
                <DialogDescription className="mt-2 text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                className="w-32"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {cancelButtonText}
              </Button>

              <Button
                variant={confirmButtonVariant}
                className="w-32"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  confirmButtonText
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
