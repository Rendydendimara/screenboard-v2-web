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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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

  // Auto scroll to active item
  useEffect(() => {
    if (!isOpen) return;

    // Wait for DOM to be ready
    const scrollToActive = () => {
      const activeItem = screenRefs.current[screen.id];

      if (activeItem) {
        // Use scrollIntoView for more reliable scrolling
        activeItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    // Try with a single appropriate delay
    const timer = setTimeout(scrollToActive, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, screen.id]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={boxRef}
          className={clsx(
            "!p-8 !rounded-[32px]",
            allScreens.length > 2 ? "max-w-[1340px]" : "w-auto",
            "h-[95vh] overflow-y-auto"
          )}
        >
          <DialogHeader>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between !h-[32px]">
              <DialogTitle className="text-2xl font-bold !h-[32px]">
                {screen.modul}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto space-x-4 scroll-smooth"
            style={{ maxWidth: `${widthContent - 50}px` }}
          >
            {allScreens.map((screenItem) => (
              <div
                key={screenItem.id}
                ref={(el) => {
                  screenRefs.current[screenItem.id] = el;
                }}
              >
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <p className="mb-1 font-[Inter] font-medium text-[14.91px] leading-[100%] tracking-[0%] text-[#565D61] break-all line-clamp-1 text-ellipsis">
                      {screenItem.name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    hidden={screenItem.name.length < 43}
                    children={
                      <p className="font-[Inter] font-medium text-[14.91px] leading-[100%] tracking-[0%] text-[#565D61]">
                        {screenItem.name}
                      </p>
                    }
                  />
                </Tooltip>

                <div
                  className={`h-[95%] group cursor-pointer w-[338px] flex-shrink-0 ${
                    screenItem.id === screen.id
                      ? "ring-2 ring-blue-500 rounded-lg"
                      : ""
                  }`}
                  onClick={() => onScreenChange && onScreenChange(screenItem)}
                >
                  <div className="bg-white rounded-lg h-full overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-200">
                    <div className="overflow-hidden h-full relative">
                      <img
                        src={screenItem.image}
                        alt={screenItem.name}
                        className={clsx(
                          "w-auto h-[100%] transition-all duration-200 rounded-lg",
                          screenItem.id === screen.id &&
                            "border border-blue-500"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
