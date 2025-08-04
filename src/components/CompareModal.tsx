import { TCategoryRes } from "@/api/user/category/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPublic } from "@/pages/Index";
import {
  Globe,
  LayoutGrid,
  List,
  Monitor,
  Plus,
  Search,
  Smartphone,
} from "lucide-react";
import React, { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import { AppCardCompare } from "./AppCardCompare";
import ImageWithFallback from "./ui/ImageWithFallback";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppPublic[];
  onRemoveApp: (appId: string) => void;
  onAddApp?: (app: AppPublic) => void;
  availableApps?: AppPublic[];
  categories: TCategoryRes[];
  setShowCompare: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  apps,
  onRemoveApp,
  onAddApp,
  availableApps = [],
  categories,
  setShowCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [indexInitialImageOpen, setIndexInitialImageOpen] = useState(0);

  const filteredAvailableApps = availableApps.filter((app) => {
    const notInCompare = !apps.find((compareApp) => compareApp.id === app.id);
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app?.category?._id === selectedCategory;

    return notInCompare && matchesSearch && matchesCategory;
  });

  const canAddMoreApps = apps.length < 3;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "iOS":
        return <Smartphone className="h-4 w-4" />;
      case "Android":
        return <Monitor className="h-4 w-4" />;
      case "Both":
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          // onCloseAutoFocus={(e) => {
          //   e.preventDefault();
          //   setShowCompare(true);
          // }}
          className="max-w-7xl max-h-[90vh] overflow-auto"
        >
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <DialogTitle className="text-2xl lg:text-3xl font-bold">
                Compare Apps
                {/* ({apps.length}/3) */}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {apps.length === 0 ? (
            <div className="text-center py-8 lg:py-12">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 lg:h-10 lg:w-10 text-slate-400" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-600 mb-2">
                No apps to compare
              </h3>
              <p className="text-slate-500">
                Search and add apps below to start comparing
              </p>
            </div>
          ) : (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid gap-4 lg:gap-6"
                  : "space-y-4 lg:space-y-6"
              }`}
              style={
                viewMode === "grid"
                  ? {
                      gridTemplateColumns: `repeat(${Math.min(
                        apps.length,
                        3
                      )}, minmax(0, 1fr))`,
                    }
                  : {}
              }
            >
              {apps.map((app, i) => (
                <AppCardCompare
                  key={i}
                  app={app}
                  viewMode={viewMode}
                  onRemoveApp={onRemoveApp}
                />
              ))}
            </div>
          )}

          {canAddMoreApps && onAddApp && (
            <div className="mt-6 lg:mt-8 border-t pt-6 lg:pt-8">
              <h3 className="text-base lg:text-lg font-semibold mb-4">
                Add Apps to Compare
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search apps to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-slate-600 flex items-center sm:col-span-2 lg:col-span-1">
                  {filteredAvailableApps.length} apps available
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                {filteredAvailableApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <ImageWithFallback
                        src={
                          app?.image ??
                          "https://source.unsplash.com/400x300?game"
                        }
                        fallbackSrc="https://placehold.co/400"
                        alt={app.name}
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {app.name}
                        </h4>
                        <p className="text-xs text-slate-600 truncate">
                          {app?.category?.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddApp(app)}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {searchTerm && filteredAvailableApps.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">
                    No apps found matching "{searchTerm}" in{" "}
                    {selectedCategory === "All"
                      ? "any category"
                      : selectedCategory}
                  </p>
                </div>
              )}
            </div>
          )}
          {!canAddMoreApps && (
            <div className="text-center mt-6 lg:mt-8 p-4 bg-amber-50 rounded-xl">
              <p className="text-amber-800 text-sm lg:text-base">
                Maximum of 3 apps can be compared. Remove an app to add a
                different one.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* <Button className="bg-red-500" onClick={() => setOpenDetailImage(true)}>
        Open Manually
      </Button> */}
    </>
  );
};
