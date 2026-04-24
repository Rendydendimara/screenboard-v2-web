import { TCategoryRes } from "@/api/user/category/type";
import { AppPublic } from "@/pages/Home/useController";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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
  const [showAddPanel, setShowAddPanel] = useState(true);

  useEffect(() => {
    if (apps.length >= 3) setShowAddPanel(false);
  }, [apps.length]);

  const filteredAvailableApps = useMemo(
    () =>
      availableApps.filter((app) => {
        const notInCompare = !apps.find((a) => a.id === app.id);
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
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
    return app.screens.filter((s) => (s.modulDetail?.name || s.modul) === mod);
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
            className="relative w-full max-w-[1100px] h-[88vh] bg-[#0C0C0C] border border-white/[0.08] rounded-[24px] flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-white font-semibold text-base">Compare Apps</h2>
                <span className="text-xs text-white/40 bg-white/[0.06] rounded-full px-2.5 py-0.5">
                  {apps.length} / 3
                </span>
                {apps.length < 2 && (
                  <span className="text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                    need {2 - apps.length} more
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {apps.length < 3 && (
                  <button
                    onClick={() => setShowAddPanel((v) => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      showAddPanel
                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                        : "bg-white/[0.06] text-white/60 hover:bg-white/[0.10] hover:text-white border border-transparent"
                    }`}
                  >
                    <Plus size={12} />
                    Add App
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors text-white/50 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Compare columns */}
              <div className="flex flex-1 min-w-0 divide-x divide-white/[0.05] overflow-x-auto">
                {apps.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/25 p-8">
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <rect x="2" y="2" width="7" height="18" rx="2" fill="currentColor" opacity="0.4" />
                        <rect x="13" y="2" width="7" height="18" rx="2" fill="currentColor" opacity="0.4" />
                      </svg>
                    </div>
                    <p className="text-sm">Add apps from the panel to start comparing</p>
                  </div>
                ) : (
                  apps.map((app) => {
                    const modules = getModulesForApp(app);
                    const activeModule = moduleFilters[app.id] || "All";
                    const screens = getFilteredScreens(app);

                    return (
                      <div key={app.id} className="flex-1 min-w-[240px] flex flex-col">
                        {/* App header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] flex-shrink-0">
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
                              <p className="text-white/35 text-[11px] truncate mt-0.5">{app.company}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveApp(app.id)}
                            className="w-6 h-6 rounded-full bg-white/[0.04] hover:bg-red-500/15 flex items-center justify-center transition-colors text-white/25 hover:text-red-400 flex-shrink-0 ml-2"
                          >
                            <X size={11} />
                          </button>
                        </div>

                        {/* Module filter pills */}
                        {modules.length > 0 && (
                          <div
                            className="flex gap-1.5 px-4 py-2.5 overflow-x-auto flex-shrink-0 border-b border-white/[0.04]"
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
                                    : "bg-white/[0.05] text-white/40 hover:text-white/70"
                                }`}
                              >
                                {mod}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Screen count */}
                        <div className="px-4 pt-2.5 pb-1 flex-shrink-0">
                          <span className="text-[11px] text-white/25">
                            {screens.length} screen{screens.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Screens — single column, full width */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                          {screens.map((screen) => (
                            <div
                              key={screen.id}
                              className="group relative rounded-[12px] overflow-hidden bg-white/[0.03] border border-white/[0.05]"
                            >
                              <ImageWithFallback
                                src={screen.image ?? ""}
                                fallbackSrc="https://placehold.co/300x533"
                                alt={screen.name}
                                containerClassName="w-full"
                                className="w-full aspect-[9/16] object-cover block"
                              />
                              <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <p className="text-white text-[11px] leading-snug truncate">{screen.name}</p>
                              </div>
                            </div>
                          ))}
                          {screens.length === 0 && (
                            <div className="flex items-center justify-center h-24 text-white/25 text-xs">
                              No screens
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ── Add App panel ── */}
              <AnimatePresence>
                {showAddPanel && apps.length < 3 && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.28 }}
                    className="flex-shrink-0 border-l border-white/[0.07] flex flex-col bg-[#0a0a0a] overflow-hidden"
                    style={{ minWidth: 0 }}
                  >
                    <div className="p-3 border-b border-white/[0.06] flex-shrink-0">
                      <p className="text-white/50 text-[11px] font-medium mb-2.5 uppercase tracking-wider">
                        {apps.length === 0
                          ? "Add 2 apps to compare"
                          : apps.length === 1
                          ? "Add 1 more app"
                          : "Optional 3rd app"}
                      </p>
                      <div className="relative mb-2">
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
                              className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                                selectedCategory === catId
                                  ? "bg-white/[0.12] text-white"
                                  : "bg-white/[0.04] text-white/35 hover:text-white/60"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {filteredAvailableApps.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-white/25 text-xs">
                          {search ? `No results for "${search}"` : "No apps available"}
                        </div>
                      ) : (
                        filteredAvailableApps.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => onAddApp?.(app)}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.03] hover:border-white/[0.09] transition-colors group text-left"
                          >
                            <ImageWithFallback
                              src={app.image ?? ""}
                              fallbackSrc="https://placehold.co/36"
                              alt={app.name}
                              containerClassName="w-8 h-8 flex-shrink-0"
                              className="w-8 h-8 rounded-[8px] object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-white/75 text-xs font-medium truncate group-hover:text-white transition-colors">
                                {app.name}
                              </p>
                              <p className="text-white/30 text-[10px] truncate mt-0.5">{app.company}</p>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-white/[0.05] group-hover:bg-purple-600/50 flex items-center justify-center flex-shrink-0 transition-colors">
                              <Plus size={10} className="text-white/50 group-hover:text-white" />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
