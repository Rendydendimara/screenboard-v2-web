import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  X,
  Smartphone,
  Search,
  Plus,
  LayoutGrid,
  List,
  Monitor,
  Globe,
} from "lucide-react";
import { AppPublic } from "@/pages/Index";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppPublic[];
  onRemoveApp: (appId: string) => void;
  onAddApp?: (app: AppPublic) => void;
  availableApps?: AppPublic[];
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  apps,
  onRemoveApp,
  onAddApp,
  availableApps = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories from available apps
  const categories = [
    "All",
    ...new Set(availableApps.map((app) => app.category)),
  ];

  const filteredAvailableApps = availableApps.filter((app) => {
    const notInCompare = !apps.find((compareApp) => compareApp.id === app.id);
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app.category === selectedCategory;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <DialogTitle className="text-2xl lg:text-3xl font-bold">
              Compare Apps ({apps.length}/3)
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
            {apps.map((app) => (
              <div
                key={app.id}
                className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${
                  viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="p-4 lg:p-6 border-b border-slate-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <img
                            src={app.image}
                            alt={app.name}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base lg:text-lg truncate">
                              {app.name}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
                              {app.company}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveApp(app.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-center mb-4">
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          {getPlatformIcon(app.platform)}
                          <span className="text-xs lg:text-sm">
                            {app.platform}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 lg:p-6">
                      <h4 className="font-medium mb-3 text-sm lg:text-base">
                        Screens ({app?.screens?.length ?? 0})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {app.screens.slice(0, 6).map((screen) => (
                          <div key={screen.id} className="group cursor-pointer">
                            <div className="aspect-[9/16] bg-slate-100 rounded-lg overflow-hidden mb-2">
                              <img
                                src={screen.image}
                                alt={screen.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {screen.name}
                              </p>
                              <Badge
                                variant="outline"
                                className="text-xs mt-1 mr-2"
                              >
                                {screen.modul}
                              </Badge>
                              <Badge variant="outline" className="text-xs mt-1">
                                {screen.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {app.screens.length > 6 && (
                        <div className="text-center mt-2">
                          <Badge variant="secondary" className="text-xs">
                            +{app.screens.length - 6} more screens
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full sm:w-32 lg:w-40 h-32 flex-shrink-0">
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 lg:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base lg:text-lg truncate">
                            {app.name}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">
                            {app.company}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveApp(app.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 ml-2 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1 w-fit"
                        >
                          {getPlatformIcon(app.platform)}
                          <span className="text-xs lg:text-sm">
                            {app.platform}
                          </span>
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {app?.screens?.length ?? 0} screens
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {app?.screens?.slice(0, 4).map((screen) => (
                          <div
                            key={screen.id}
                            className="aspect-[9/16] bg-slate-100 rounded overflow-hidden"
                          >
                            <img
                              src={screen.image}
                              alt={screen.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
                    <SelectItem key={category} value={category}>
                      {category}
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
                    <img
                      src={app.image}
                      alt={app.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {app.name}
                      </h4>
                      <p className="text-xs text-slate-600 truncate">
                        {app.category}
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
  );
};
