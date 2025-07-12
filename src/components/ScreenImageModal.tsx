import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnnotationOverlay } from "@/components/AnnotationOverlay";
import { Annotation } from "@/types/annotations";
import { useDownloadLimit } from "@/hooks/useDownloadLimit";
import { useScreenHistory } from "@/hooks/useScreenHistory";
import { MonetizationModal } from "@/components/MonetizationModal";
import { useToast } from "@/hooks/use-toast";

interface Screen {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

interface ScreenImageModalProps {
  screen: Screen;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (newImage: string) => void;
  allScreens?: Screen[];
  onScreenChange?: (screen: Screen) => void;
}

// Mock annotations data
const mockAnnotations: Annotation[] = [
  {
    id: "1",
    screenId: "1",
    appId: 1,
    x: 25,
    y: 30,
    title: "Navigation Pattern",
    description:
      "Bottom tab navigation following iOS Human Interface Guidelines with proper touch targets and visual hierarchy.",
    type: "ui-pattern",
    category: "Navigation",
    tags: ["iOS", "tabs", "navigation", "accessibility"],
    createdBy: "Admin",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    isVisible: true,
    color: "#3B82F6",
  },
  {
    id: "2",
    screenId: "1",
    appId: 1,
    x: 75,
    y: 15,
    title: "Search Interaction",
    description:
      "Search functionality with autocomplete suggestions and recent searches for improved user experience.",
    type: "interaction",
    category: "Search",
    tags: ["search", "autocomplete", "UX"],
    createdBy: "Admin",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    isVisible: true,
    color: "#10B981",
  },
];

export const ScreenImageModal: React.FC<ScreenImageModalProps> = ({
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

  const currentIndex = allScreens.findIndex((s) => s.id === screen.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allScreens.length - 1;

  // Filter annotations for current screen
  const screenAnnotations = mockAnnotations.filter(
    (annotation) => annotation.screenId === screen.id
  );

  // Record screen view when modal opens
  useEffect(() => {
    if (isOpen) {
      addToHistory({
        screenId: screen.id,
        screenName: screen.name,
        category: screen.category,
        appName: "Current App", // This should come from props in real implementation
        action: "viewed",
      });
    }
  }, [isOpen, screen.id, screen.name, screen.category, addToHistory]);

  const goToPrevious = () => {
    if (hasPrevious && onScreenChange) {
      onScreenChange(allScreens[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (hasNext && onScreenChange) {
      onScreenChange(allScreens[currentIndex + 1]);
    }
  };

  const handleDownload = () => {
    if (!canDownload) {
      setShowMonetizationModal(true);
      return;
    }

    const success = recordDownload(screen.id, screen.name, screen.category);
    if (success) {
      // Add to history
      addToHistory({
        screenId: screen.id,
        screenName: screen.name,
        category: screen.category,
        appName: "Current App", // This should come from props in real implementation
        action: "downloaded",
      });

      // Simulate download
      const link = document.createElement("a");
      link.href = screen.image;
      link.download = `${screen.name}-screen.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download successful",
        description: `${screen.name} has been downloaded. ${
          remainingDownloads - 1
        } downloads remaining.`,
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {screen.name}
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Detailed view of {screen.name} screen from the{" "}
                  {screen.category} category
                </DialogDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{screen.category}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    Downloads remaining: {remainingDownloads}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!canDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {canDownload ? "Download" : "Limit Reached"}
                </Button>
                {allScreens.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      disabled={!hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500">
                      {currentIndex + 1} of {allScreens.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      disabled={!hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Main Image with Annotations */}
            <div className="flex justify-center">
              <div className="max-w-md relative">
                <div className="aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative">
                  <img
                    src={screen.image}
                    alt={screen.name}
                    className="w-full h-full object-cover"
                  />
                  <AnnotationOverlay
                    annotations={screenAnnotations}
                    imageWidth={384} // max-w-md in pixels
                    imageHeight={683} // aspect-[9/16] calculation
                    showAnnotations={showAnnotations}
                    onToggleAnnotations={() =>
                      setShowAnnotations(!showAnnotations)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-center">
              <p className="text-gray-600 leading-relaxed">
                {screen.description}
              </p>
              {screenAnnotations.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  This screen has {screenAnnotations.length} annotation
                  {screenAnnotations.length !== 1 ? "s" : ""} highlighting UX
                  patterns and interactions.
                </p>
              )}
            </div>

            {/* Horizontal Screen Navigation */}
            {allScreens.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Browse All Screens
                </h3>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-4 p-4">
                    {allScreens.map((screenItem, index) => (
                      <div
                        key={screenItem.id}
                        className={`group cursor-pointer w-32 flex-shrink-0 ${
                          screenItem.id === screen.id
                            ? "ring-2 ring-blue-500 rounded-lg"
                            : ""
                        }`}
                        onClick={() =>
                          onScreenChange && onScreenChange(screenItem)
                        }
                      >
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="aspect-[9/16] overflow-hidden relative">
                            <img
                              src={screenItem.image}
                              alt={screenItem.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {screenItem.id === screen.id && (
                              <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg"></div>
                            )}
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium text-xs text-center truncate">
                              {screenItem.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs mt-1 w-full justify-center"
                            >
                              {screenItem.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
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
