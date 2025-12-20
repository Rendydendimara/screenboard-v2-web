import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Screenshot } from "./types";
import ImageWithFallback from "../ui/ImageWithFallback";

interface ViewScreenshotModalProps {
  isOpen: boolean;
  screenshot: Screenshot | null;
  onClose: () => void;
}

export const ViewScreenshotModal: React.FC<ViewScreenshotModalProps> = ({
  isOpen,
  screenshot,
  onClose,
}) => {
  if (!isOpen || !screenshot) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm !m-0"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageWithFallback
          src={screenshot.image}
          fallbackSrc={screenshot.image}
          alt={screenshot.name ?? ""}
          containerClassName="max-w-full max-h-full"
          className="max-w-full max-h-full object-contain shadow-2xl"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/30"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
