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
import ImageWithFallback from "./ui/ImageWithFallback";

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
            "!p-8 !rounded-[24px] h-[90vh] max-h-[786px]",
            allScreens.length > 2 ? "max-w-[1340px]" : "w-auto",
            "overflow-y-auto"
          )}
        >
          <DialogHeader>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between !h-[32px]">
              <DialogTitle className="text-2xl font-bold !h-[32px]">
                {screen?.category?.name ?? ""}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto gap-6 scroll-smooth px-4"
            style={{ maxWidth: `${widthContent - 50}px` }}
          >
            {allScreens.map((screenItem) => (
              <div
                key={screenItem.id}
                ref={(el) => {
                  screenRefs.current[screenItem.id] = el;
                }}
                className="w-[288px] flex items-start flex-col gap-2"
              >
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <p className="font-[Inter] font-medium text-[14.91px] leading-[100%] tracking-[0%] text-[#565D61] break-all line-clamp-1 text-ellipsis">
                      {screenItem.name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    hidden={screenItem.name.length < 25}
                    children={
                      <p className="font-[Inter] font-medium text-[14.91px] leading-[100%] tracking-[0%] text-[#565D61]">
                        {screenItem.name}
                      </p>
                    }
                  />
                </Tooltip>

                <div
                  className={clsx(
                    "h-[95%] group cursor-pointer  w-[288px] flex-shrink-0 ",
                    screenItem.id === screen.id &&
                      "ring-2 ring-blue-500 rounded-[8px]"
                  )}
                  onClick={() => onScreenChange && onScreenChange(screenItem)}
                >
                  <div className="bg-white rounded-[8px] w-[288px]  h-full overflow-hidden shadow-sm hover:shadow-2xl tråansition-shadow duration-200">
                    <div className="overflow-hidden flex-1 h-full w-full relative flex justify-center items-center">
                      <ImageWithFallback
                        fallbackSrc={screenItem.image}
                        src={screenItem.image}
                        alt={screenItem.name}
                        containerClassName="h-[100%] fill-available w-full minw-h-[648px] max-h-[648px]"
                        className={clsx(
                          "fill-available h-[100%] transition-all duration-200 w-full  border rounded-[8px] border-solid border-[#ECECEC]",
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
