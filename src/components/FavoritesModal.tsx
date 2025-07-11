import { Badge } from "@/components/ui/badge";
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
import { ScreenPublic } from "@/pages/Index";
import { Heart, LayoutGrid, List, Search, X } from "lucide-react";
import React, { useState } from "react";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteScreens: ScreenPublic[];
  onRemoveFavorite: (screen: ScreenPublic) => void;
  onScreenClick: (screen: ScreenPublic) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteScreens,
  onRemoveFavorite,
  onScreenClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories from favorite screens
  const categories = [
    "All",
    ...new Set(favoriteScreens.map((screen) => screen.category)),
  ];

  const filteredScreens = favoriteScreens.filter((screen) => {
    const matchesSearch =
      screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.appName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || screen.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <DialogTitle className="text-2xl lg:text-3xl font-bold flex items-center">
              <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-red-500 mr-3" />
              Favorite Screens ({favoriteScreens.length})
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

        {favoriteScreens.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 lg:h-10 lg:w-10 text-slate-400" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-slate-600 mb-2">
              No favorite screens yet
            </h3>
            <p className="text-slate-500">
              Start exploring apps and add screens to your favorites!
            </p>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search favorite screens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
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

                <div className="text-sm text-slate-600 flex items-center">
                  {filteredScreens.length} of {favoriteScreens.length} screens
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== "All") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>Search: {searchTerm}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>Category: {selectedCategory}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedCategory("All")}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Screens Grid/List */}
            {filteredScreens.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 lg:h-10 lg:w-10 text-slate-400" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-slate-600 mb-2">
                  No screens found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
                    : "space-y-4"
                }
              >
                {filteredScreens.map((screen) => (
                  <div
                    key={screen.id}
                    className={`group cursor-pointer ${
                      viewMode === "list"
                        ? "flex bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div
                          className="aspect-[9/16] bg-slate-100 overflow-hidden relative"
                          onClick={() => onScreenClick(screen)}
                        >
                          <img
                            src={screen.image}
                            alt={screen.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        <div className="p-3 lg:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-slate-900 truncate">
                                {screen.name}
                              </h3>
                              <p className="text-xs text-slate-500 truncate">
                                {screen.appName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(screen);
                              }}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0 ml-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {screen.category}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 cursor-pointer"
                          onClick={() => onScreenClick(screen)}
                        >
                          <img
                            src={screen.image}
                            alt={screen.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 p-4 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-base text-slate-900 truncate">
                                {screen.name}
                              </h3>
                              <p className="text-sm text-slate-500 truncate">
                                {screen.appName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(screen);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {screen.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {screen.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
