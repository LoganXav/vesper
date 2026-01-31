"use client";

import { useState, cloneElement, isValidElement, ReactElement } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

interface ConfirmationDialogProps {
  children: ReactElement;
  title?: string;
  description?: string;
  confirmText?: string;
  isPending?: boolean;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

export const ConfirmationDialog = ({
  children,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  isPending = false,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to confirm action");
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  // Clone the child element and add stopPropagation to prevent parent click handlers
  const triggerElement = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{ onClick?: (e: React.MouseEvent) => void }>,
        {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            const props = children.props as {
              onClick?: (e: React.MouseEvent) => void;
            };
            props?.onClick?.(e);
          },
        },
      )
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            size="sm"
          >
            {confirmText}
            {isPending && <Loader className="size-3 text-background" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
