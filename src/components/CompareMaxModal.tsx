import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompareMaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareMaxModal: React.FC<CompareMaxModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm !rounded-[24px] p-8 text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            Compare Screen
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-1">
          You can only compare up to 3 apps.
        </p>
        <Button
          onClick={onClose}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl h-11"
        >
          Ok
        </Button>
      </DialogContent>
    </Dialog>
  );
};
