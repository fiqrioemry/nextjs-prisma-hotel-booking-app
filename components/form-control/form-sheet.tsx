import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { ReactNode } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { useFormSchema } from '@/hooks/use-form-schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useCallback, useEffect } from 'react';
import { ErrorMessage } from '@/components/shared/error-message';
import { SubmitButton } from '@/components/form-control/submit-button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface FormSheetProps {
  title: string;
  state?: any;
  submitText?: string;
  schema: any;
  action: (data: any) => Promise<any>;
  children: ReactNode;
  description?: string;
  loading?: boolean;
  buttonElement?: ReactNode;
}

export function FormSheet({
  title,
  submitText = 'Save Changes',
  state,
  schema,
  action,
  children,
  description = 'Submit button will activate when you make changes.',
  loading = false,
  buttonElement = (
    <Button size="icon" type="button">
      <Pencil className="w-4 h-4" />
    </Button>
  ),
}: FormSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = useCallback(
    async (data: any) => {
      const result = await action(data);
      if (result.success) {
        closeSheet();
      }
      setError(result.error);
    },
    [action]
  );

  const form = useFormSchema({
    state: state ? state : {},
    schema: schema,
    action: handleSave,
    mode: 'onChange',
  });

  const { isDirty, methods, reset, handleSubmit } = form;

  const closeSheet = useCallback(() => {
    reset();
    setIsOpen(false);
  }, [reset]);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      setShowConfirmation(true);
    } else {
      closeSheet();
    }
  }, [isDirty, closeSheet]);

  const handleConfirmation = useCallback(
    (confirmed: boolean) => {
      setShowConfirmation(false);
      if (confirmed) closeSheet();
    },
    [closeSheet]
  );

  // Sync form state with prop changes
  useEffect(() => {
    if (state) reset(state);
  }, [state, reset]);

  return (
    <>
      {/* Main Sheet */}
      <Sheet
        open={isOpen}
        onOpenChange={open => (!open ? handleCancel() : setIsOpen(open))}
      >
        <SheetTrigger asChild>{buttonElement}</SheetTrigger>

        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          {loading ? (
            <div className="flex items-center justify-center h-full py-6">
              <div className="text-center">
                <Loader2 className="mx-auto animate-spin mb-2" size={40} />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="border-b p-4">
                <SheetHeader>
                  <SheetTitle className="text-lg font-semibold text-center">
                    {title}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground text-center">
                    {description}
                  </SheetDescription>
                </SheetHeader>
                {error && (
                  <ErrorMessage
                    title={error}
                    onclearError={() => setError(null)}
                  />
                )}
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">{children}</div>
                  </ScrollArea>
                  <div className="grid grid-cols-2 p-4 border-t">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <SubmitButton
                      text={submitText}
                      isLoading={methods.formState.isSubmitting}
                      disabled={!isDirty || !methods.formState.isValid}
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <div className="text-center">
            <DialogTitle className="text-xl font-semibold">
              Unsaved Changes
            </DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              You have made changes. Are you sure you want to discard them?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleConfirmation(false)}>
              Keep Editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleConfirmation(true)}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
