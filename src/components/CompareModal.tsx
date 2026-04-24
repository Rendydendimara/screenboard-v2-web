import { TCategoryRes } from "@/api/user/category/type";
import { AppPublic } from "@/pages/Home/useController";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import ImageWithFallback from "./ui/ImageWithFallback";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppPublic[];
  onRemoveApp: (appId: string) => void;
  onAddApp?: (app: AppPublic) => void;
  availableApps?: AppPublic[];
  categories: TCategoryRes[];
  setShowCompare: (show: boolean) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  apps,
  onRemoveApp,
  onAddApp,
  availableApps = [],
  categories,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [moduleFilters, setModuleFilters] = useState<Record<string, string>>({});
  const filteredAvailableApps = useMemo(
    () =>
      availableApps.filter((app) => {
        const notInCompare = !apps.find((a) => a.id === app.id);
        const matchesSearch = app.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" || app?.category?._id === selectedCategory;
        return notInCompare && matchesSearch && matchesCategory;
      }),
    [availableApps, apps, search, selectedCategory]
  );

  const getModulesForApp = (app: AppPublic) =>
    Array.from(
      new Set(
        app.screens
          .map((s) => s.modulDetail?.name || s.modul)
          .filter((n): n is string => !!n)
      )
    );

  const getFilteredScreens = (app: AppPublic) => {
    const mod = moduleFilters[app.id] || "All";
    if (mod === "All") return app.screens;
    return app.screens.filter(
      (s) => (s.modulDetail?.name || s.modul) === mod
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
            className="relative w-full max-w-[1200px] max-h-[90vh] bg-[#0C0C0C] border border-white/[0.08] rounded-[24px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold text-lg">Compare Apps</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40 bg-white/[0.06] rounded-full px-2.5 py-0.5">
                    {apps.length} / 3
                  </span>
                  {apps.length < 2 && (
                    <span className="text-xs text-purple-400/80 bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-0.5">
                      need {2 - apps.length} more
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors text-white/50 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* Columns area */}
            <div className="flex-1 overflow-hidden min-h-0">
              {apps.length === 0 ? (
                /* Empty state — full-width search + grid picker */
                <div className="h-full flex flex-col p-6 gap-4">
                  <p className="text-white/40 text-sm text-center">
                    Search and add at least 2 apps to compare
                  </p>
                  <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder="Search apps..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors"
                      />
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                      {["All", ...categories.map((c) => c.name)].map((cat, idx) => {
                        const catId = idx === 0 ? "All" : categories[idx - 1]._id;
                        return (
                          <button
                            key={catId}
                            onClick={() => setSelectedCategory(catId)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                              selectedCategory === catId
                                ? "bg-white/[0.14] text-white"
                                : "bg-white/[0.05] text-white/35 hover:text-white/60"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filteredAvailableApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => onAddApp?.(app)}
                        className="flex items-center gap-2.5 p-2.5 rounded-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/[0.12] transition-colors group text-left"
                      >
                        <ImageWithFallback
                          src={app.image ?? ""}
                          fallbackSrc="https://placehold.co/32"
                          alt={app.name}
                          containerClassName="w-8 h-8 flex-shrink-0"
                          className="w-8 h-8 rounded-[7px] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">
                            {app.name}
                          </p>
                          <p className="text-white/30 text-[10px] truncate">{app.company}</p>
                        </div>
                      </button>
                    ))}
                    {filteredAvailableApps.length === 0 && (
                      <div className="col-span-4 flex items-center justify-center h-16 text-white/25 text-sm">
                        {search ? `No results for "${search}"` : "No apps available"}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Columns layout */
                <div className="flex gap-3 h-full p-4 overflow-x-auto">
                  {/* App columns */}
                  {apps.map((app) => {
                    const modules = getModulesForApp(app);
                    const activeModule = moduleFilters[app.id] || "All";
                    const screens = getFilteredScreens(app);

                    return (
                      <div
                        key={app.id}
                        className="flex-1 min-w-[220px] max-w-[300px] flex flex-col bg-[#111] border border-white/[0.06] rounded-[18px] overflow-hidden"
                      >
                        {/* App info header */}
                        <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/[0.06] flex-shrink-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ImageWithFallback
                              src={app.image ?? ""}
                              fallbackSrc="https://placehold.co/32"
                              alt={app.name}
                              containerClassName="w-8 h-8 flex-shrink-0"
                              className="w-8 h-8 rounded-[8px] object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-white text-sm font-medium leading-tight truncate">{app.name}</p>
                              <p className="text-white/40 text-xs truncate mt-0.5">{app.company}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveApp(app.id)}
                            className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-red-500/15 flex items-center justify-center transition-colors text-white/30 hover:text-red-400 flex-shrink-0 ml-2"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        {/* Module filter pills */}
                        {modules.length > 0 && (
                          <div
                            className="flex gap-1.5 px-3 py-2.5 overflow-x-auto flex-shrink-0 border-b border-white/[0.04]"
                            style={{ scrollbarWidth: "none" }}
                          >
                            {["All", ...modules].map((mod) => (
                              <button
                                key={mod}
                                onClick={() =>
                                  setModuleFilters((prev) => ({ ...prev, [app.id]: mod }))
                                }
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                                  activeModule === mod
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.09]"
                                }`}
                              >
                                {mod}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Screen count */}
                        <div className="px-3.5 pt-2 pb-1 flex-shrink-0">
                          <span className="text-[11px] text-white/25">
                            {screens.length} screen{screens.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Screens grid */}
                        <div className="flex-1 overflow-y-auto px-3 pb-3 grid grid-cols-2 gap-2 content-start">
                          {screens.map((screen) => (
                            <div
                              key={screen.id}
                              className="group relative rounded-[10px] overflow-hidden bg-white/[0.03] border border-white/[0.04]"
                            >
                              <ImageWithFallback
                                src={screen.image ?? ""}
                                fallbackSrc="https://placehold.co/120x213"
                                alt={screen.name}
                                containerClassName="w-full"
                                className="w-full aspect-[9/16] object-cover block"
                              />
                              <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <p className="text-white text-[10px] leading-snug truncate">{screen.name}</p>
                              </div>
                            </div>
                          ))}
                          {screens.length === 0 && (
                            <div className="col-span-2 flex items-center justify-center h-24 text-white/25 text-xs">
                              No screens
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add app slot (shown when < 3 apps) */}
                  {apps.length < 3 && (
                    <div className="flex-1 min-w-[220px] max-w-[300px] flex flex-col bg-[#111] border border-dashed border-white/[0.10] rounded-[18px] overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
                        <p className="text-white/60 text-sm font-medium">
                          {apps.length < 2 ? "Add another app" : "Add app"}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {apps.length < 2 ? "At least 2 apps needed" : "Optional 3rd app"}
                        </p>
                      </div>
                      <div className="px-3 py-3 flex flex-col gap-2 flex-shrink-0 border-b border-white/[0.06]">
                        <div className="relative">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            placeholder="Search apps..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors"
                          />
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                          {["All", ...categories.map((c) => c.name)].map((cat, idx) => {
                            const catId = idx === 0 ? "All" : categories[idx - 1]._id;
                            return (
                              <button
                                key={catId}
                                onClick={() => setSelectedCategory(catId)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                                  selectedCategory === catId
                                    ? "bg-white/[0.12] text-white"
                                    : "bg-white/[0.04] text-white/35 hover:text-white/60 hover:bg-white/[0.07]"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                        {filteredAvailableApps.length === 0 ? (
                          <div className="flex items-center justify-center h-20 text-white/25 text-xs">
                            {search ? `No results for "${search}"` : "No apps available"}
                          </div>
                        ) : (
                          filteredAvailableApps.map((app) => (
                            <button
                              key={app.id}
                              onClick={() => onAddApp?.(app)}
                              className="w-full flex items-center gap-2.5 p-2.5 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.10] transition-colors group text-left"
                            >
                              <ImageWithFallback
                                src={app.image ?? ""}
                                fallbackSrc="https://placehold.co/36"
                                alt={app.name}
                                containerClassName="w-9 h-9 flex-shrink-0"
                                className="w-9 h-9 rounded-[8px] object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">
                                  {app.name}
                                </p>
                                <p className="text-white/30 text-[10px] truncate mt-0.5">{app.company}</p>
                              </div>
                              <div className="w-5 h-5 rounded-full bg-white/[0.06] group-hover:bg-purple-600/60 flex items-center justify-center flex-shrink-0 transition-colors">
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                  <path
                                    d="M4.5 1v7M1 4.5h7"
                                    stroke="white"
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                    strokeOpacity={0.5}
                                  />
                                </svg>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
