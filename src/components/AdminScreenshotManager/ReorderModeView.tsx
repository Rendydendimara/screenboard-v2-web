import React from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownUp, GripVertical, Save } from "lucide-react";
import { TAppRes } from "@/api/admin/app/type";
import { TModulRes } from "@/api/admin/modul/type";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { TSelect } from "@/types";
import {
  SortableModuleItem,
  SortableCategoryItem,
  SortableScreenshotItem,
} from "./SortableItems";
import { ReorderLevel, Screenshot } from "./types";

interface ReorderModeViewProps {
  reorderLevel: ReorderLevel;
  selectedReorderApp: TAppRes | null;
  selectedReorderModule: TModulRes | null;
  selectedReorderCategory: TScreenCategoryRes | null;
  listApp: TSelect[];
  orderedModules: TModulRes[];
  orderedCategories: TScreenCategoryRes[];
  orderedScreenshots: Screenshot[];
  activeId: string | null;
  onBackNavigation: () => void;
  onSelectApp: (app: TAppRes) => void;
  onSelectModule: (modul: TModulRes) => void;
  onSelectCategory: (category: TScreenCategoryRes) => void;
  onSaveModuleOrder: () => void;
  onSaveCategoryOrder: () => void;
  onSaveScreenshotOrder: () => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (screenshot: Screenshot) => void;
  onDelete: (id: string, name: string) => void;
}

export const ReorderModeView: React.FC<ReorderModeViewProps> = ({
  reorderLevel,
  selectedReorderApp,
  selectedReorderModule,
  selectedReorderCategory,
  listApp,
  orderedModules,
  orderedCategories,
  orderedScreenshots,
  activeId,
  onBackNavigation,
  onSelectApp,
  onSelectModule,
  onSelectCategory,
  onSaveModuleOrder,
  onSaveCategoryOrder,
  onSaveScreenshotOrder,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      {reorderLevel !== "app" && (
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={onBackNavigation}>
            <ArrowDownUp className="h-4 w-4 mr-2 rotate-90" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-gray-600">
            {selectedReorderApp && (
              <>
                <span className="font-medium">{selectedReorderApp.name}</span>
                <span>/</span>
              </>
            )}
            {selectedReorderModule && reorderLevel !== "module" && (
              <>
                <span className="font-medium">
                  {selectedReorderModule.name}
                </span>
                <span>/</span>
              </>
            )}
            {selectedReorderCategory && reorderLevel === "screenshot" && (
              <span className="font-medium">
                {selectedReorderCategory.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Level: App Selection */}
      {reorderLevel === "app" && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Select App to Reorder
            </h3>
            <p className="text-sm text-blue-700">
              Choose an app to manage the order of its modules, categories, and
              screenshots.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listApp.map((app) => {
              const appData = {
                _id: app.value,
                name: app.label,
              } as TAppRes;
              return (
                <Card
                  key={app.value}
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                  onClick={() => onSelectApp(appData)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{app.label}</h4>
                      <ArrowDownUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Click to manage order
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Level: Module List */}
      {reorderLevel === "module" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                Modules in {selectedReorderApp?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Drag to reorder, click to view categories
              </p>
            </div>
            {/* <Button
              onClick={onSaveModuleOrder}
              disabled={orderedModules.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Module Order
            </Button> */}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              disabled
              items={orderedModules.map((m) => m._id)}
              strategy={rectSortingStrategy}
            >
              <div className="space-y-3">
                {orderedModules.map((modul) => (
                  <SortableModuleItem
                    key={modul._id}
                    modul={modul}
                    onClick={() => onSelectModule(modul)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Level: Category List */}
      {reorderLevel === "category" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                Categories in {selectedReorderModule?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Drag to reorder, click to view screenshots
              </p>
            </div>
            {/* <Button
              onClick={onSaveCategoryOrder}
              disabled={orderedCategories.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Category Order
            </Button> */}
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              disabled
              items={orderedCategories.map((c) => c._id)}
              strategy={rectSortingStrategy}
            >
              <div className="space-y-3">
                {orderedCategories.map((category) => (
                  <SortableCategoryItem
                    key={category._id}
                    category={category}
                    onClick={() => onSelectCategory(category)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Level: Screenshot List */}
      {reorderLevel === "screenshot" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                Screenshots in {selectedReorderCategory?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Drag to reorder screenshots
              </p>
            </div>
            <Button
              onClick={onSaveScreenshotOrder}
              disabled={orderedScreenshots.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Screenshot Order
            </Button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={orderedScreenshots.map((s) => s.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {orderedScreenshots.map((screenshot) => (
                  <SortableScreenshotItem
                    key={screenshot.id}
                    screenshot={screenshot}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay
              dropAnimation={{
                duration: 200,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeId && reorderLevel === "screenshot" ? (
                <div className="w-64 cursor-grabbing">
                  <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 ring-4 ring-blue-500 shadow-2xl transform rotate-3">
                    <div className="absolute top-2 left-2 z-10 bg-blue-500 rounded-full p-1.5 shadow-lg scale-110">
                      <GripVertical className="h-4 w-4 text-white" />
                    </div>
                    <img
                      src={
                        orderedScreenshots.find((s) => s.id === activeId)?.image
                      }
                      alt={
                        orderedScreenshots.find((s) => s.id === activeId)
                          ?.name ?? ""
                      }
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};
