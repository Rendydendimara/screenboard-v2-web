import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TModulRes } from "@/api/admin/modul/type";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { Screenshot } from "./types";

// Sortable Module Item
export const SortableModuleItem: React.FC<{
  modul: TModulRes;
  onClick: () => void;
}> = ({ modul, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: modul._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 shadow-xl"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="font-medium">{modul.name}</div>
          </div>
          <div
            className={`cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-100 ${
              isDragging ? "bg-blue-500 text-white" : ""
            }`}
            onClick={handleDragHandleClick}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable Category Item
export const SortableCategoryItem: React.FC<{
  category: TScreenCategoryRes;
  onClick: () => void;
}> = ({ category, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 shadow-xl"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="font-medium">{category.name}</div>
          </div>
          <div
            className={`cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-100 ${
              isDragging ? "bg-blue-500 text-white" : ""
            }`}
            onClick={handleDragHandleClick}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable Screenshot Item
export const SortableScreenshotItem: React.FC<{
  screenshot: Screenshot;
  onEdit: (screenshot: Screenshot) => void;
  onDelete: (id: string, name: string) => void;
}> = ({ screenshot, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screenshot.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`shrink-0 w-full relative group cursor-move ${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`w-full h-72 rounded-lg overflow-hidden bg-gray-100 transition-all duration-200 ${
          isDragging
            ? "shadow-2xl ring-2 ring-blue-400 ring-opacity-50"
            : "shadow-md hover:shadow-lg"
        }`}
      >
        <div
          className={`absolute top-2 left-2 z-10 bg-white rounded-full p-1.5 shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isDragging ? "bg-blue-500 text-white scale-110" : "hover:bg-gray-50"
          }`}
          {...attributes}
          {...listeners}
        >
          <GripVertical
            className={`h-4 w-4 ${isDragging ? "text-white" : "text-gray-600"}`}
          />
        </div>
        <img
          src={screenshot.image}
          alt={screenshot?.name ?? ""}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        {screenshot.dominantColor && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{
              backgroundColor: screenshot.dominantColor,
            }}
          />
        )}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none" />
        )}
      </div>
      <div className="mt-2 text-xs">
        <div className="font-medium">{screenshot?.name ?? ""}</div>
        {screenshot.colors && (
          <div className="flex space-x-1 mt-1">
            {screenshot.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
