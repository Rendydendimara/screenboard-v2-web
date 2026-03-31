import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { TSelect } from "@/types";
import { Screenshot } from "./types";
import ImageWithFallback from "../ui/ImageWithFallback";

const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "6px",
    borderColor: "#e2e8f0",
    fontSize: "14px",
  }),
};

interface NormalViewProps {
  screenshots: Screenshot[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedModuleFilter: TSelect | null;
  onModuleFilterChange: (id: string) => void;
  selectedCategoryFilter: TSelect | null;
  onCategoryFilterChange: (id: string) => void;
  moduleOptions: TSelect[];
  categoryOptions: TSelect[];
  onView: (screenshot: Screenshot) => void;
  onEdit: (screenshot: Screenshot) => void;
  onDelete: (id: string, name: string) => void;
}

const ALL_CATEGORY_OPTION = { value: "", label: "All" };

export const NormalView: React.FC<NormalViewProps> = ({
  screenshots,
  searchTerm,
  onSearchChange,
  selectedModuleFilter,
  onModuleFilterChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  moduleOptions,
  categoryOptions,
  onView,
  onEdit,
  onDelete,
}) => {
  const categorySelectOptions = [ALL_CATEGORY_OPTION, ...categoryOptions];

  return (
    <>
      <div className="mb-4 flex gap-2 items-start justify-start">
        <div className="flex-1 sm:flex-none sm:min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Modul</label>
          <ReactSelect
            isSearchable
            placeholder="Select Modul"
            options={moduleOptions}
            value={selectedModuleFilter ?? null}
            onChange={(opt) => onModuleFilterChange(opt?.value?.toString() ?? "")}
            styles={reactSelectStyles}
          />
        </div>

        <div className="flex-1 sm:flex-none sm:min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Category</label>
          <ReactSelect
            isSearchable
            placeholder="Select Category"
            options={categorySelectOptions}
            value={selectedCategoryFilter ?? ALL_CATEGORY_OPTION}
            onChange={(opt) => onCategoryFilterChange(opt?.value?.toString() ?? "")}
            styles={reactSelectStyles}
          />
        </div>

        <Input
          placeholder="Search screenshots..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>
      {selectedModuleFilter?.value ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="shrink-0 w-full group cursor-pointer"
            >
              <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                <ImageWithFallback
                  src={screenshot.image}
                  fallbackSrc={screenshot.image}
                  alt={screenshot?.name ?? ""}
                  containerClassName="w-full"
                  className="w-full h-auto object-contain"
                />
                {screenshot.dominantColor && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{
                      backgroundColor: screenshot.dominantColor,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onView(screenshot)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(screenshot)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      onDelete(screenshot.id, screenshot?.name ?? "")
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p
                className="mt-2 mb-4 text-sm font-medium text-[#565D61] truncate"
                title={screenshot?.name ?? ""}
              >
                {screenshot?.name || "-"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Module Selected
            </h3>
            <p className="text-sm text-gray-500">
              Please select a module from the dropdown above to view
              screenshots.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
