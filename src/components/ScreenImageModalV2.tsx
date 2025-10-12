import { AnnotationOverlay } from "@/components/AnnotationOverlay";
import { MonetizationModal } from "@/components/MonetizationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useDownloadLimit } from "@/hooks/useDownloadLimit";
import { useScreenHistory } from "@/hooks/useScreenHistory";
import { Annotation } from "@/types/annotations";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Screen {
  id: string;
  name: string;
  category?: {
    _id: string;
    name: string;
  };
  image: string;
  description: string;
  modul: string;
}

interface ScreenImageModalProps {
  screen: Screen;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (newImage: string) => void;
  allScreens?: Screen[];
  onScreenChange?: (screen: Screen) => void;
}

export const ScreenImageModalV2: React.FC<ScreenImageModalProps> = ({
  screen,
  isOpen,
  onClose,
  allScreens = [],
  onScreenChange,
}) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showMonetizationModal, setShowMonetizationModal] = useState(false);
  const {
    canDownload,
    remainingDownloads,
    recordDownload,
    DOWNLOAD_LIMIT,
    downloadData,
  } = useDownloadLimit();
  const { addToHistory } = useScreenHistory();
  const { toast } = useToast();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [widthContent, setWidthContent] = useState<number>(0);

  const currentIndex = allScreens.findIndex((s) => s.id === screen.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allScreens.length - 1;

  // Record screen view when modal opens
  useEffect(() => {
    if (isOpen) {
      addToHistory({
        screenId: screen.id,
        screenName: screen.name,
        category: screen?.category?.name,
        appName: "Current App", // This should come from props in real implementation
        action: "viewed",
      });
    }
  }, [isOpen, screen.id, screen.name, screen.category, addToHistory]);

  useEffect(() => {
    const updateWidth = () => {
      if (boxRef.current) {
        setWidthContent(boxRef.current.offsetWidth);
      }
    };

    updateWidth(); // jalankan sekali
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [boxRef.current]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={boxRef}
          className={clsx(
            "!p-8 !rounded-[32px]",
            allScreens.length > 2 ? "max-w-[1340px]" : "w-auto",
            "h-[90vh] overflow-y-auto"
          )}
        >
          <DialogHeader>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {screen.modul}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  {screen.name} - {screen?.category?.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="w-full whitespace-nowrap">
            <div
              className="flex w-full overflow-x-auto space-x-4"
              style={{ maxWidth: `${widthContent - 50}px` }}
            >
              {allScreens.map((screenItem, index) => (
                <div
                  key={screenItem.id}
                  className={`group cursor-pointer w-[338px] flex-shrink-0 ${
                    screenItem.id === screen.id
                      ? "ring-2 ring-blue-500 rounded-lg"
                      : ""
                  }`}
                  onClick={() => onScreenChange && onScreenChange(screenItem)}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="overflow-hidden relative">
                      <img
                        src={screenItem.image}
                        alt={screenItem.name}
                        className="w-[338px] h-[749px] group-hover:scale-105 object-contain transition-transform duration-200"
                      />
                      {screenItem.id === screen.id && (
                        <div className="absolute inset-0 border border-blue-500 rounded-lg"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <MonetizationModal
        isOpen={showMonetizationModal}
        onClose={() => setShowMonetizationModal(false)}
        currentDownloads={downloadData.count}
        maxDownloads={DOWNLOAD_LIMIT}
      />
    </>
  );
};
