import React from "react";
import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { FolderOpen, Trash2, Upload } from "lucide-react";
import { TSelect } from "@/types";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { FORMAT_INPUT_IMAGE_FILE } from "@/constant/app";
import { formatFileSize, getImageUrlFromFile } from "@/utils";
import { BulkFileItem } from "./types";
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

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  bulkFiles: BulkFileItem[];
  onFilesChange: (files: BulkFileItem[]) => void;
  selectedApp: string;
  onAppChange: (value: string) => void;
  selectedModul: string;
  onModulChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  listApp: TSelect[];
  listModule: TSelect[];
  categories: TScreenCategoryRes[];
  appId?: string;
  isLoading?: boolean;
  onFileSelect: (files: any) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bulkFiles,
  onFilesChange,
  selectedApp,
  onAppChange,
  selectedModul,
  onModulChange,
  selectedCategory,
  onCategoryChange,
  listApp,
  listModule,
  categories,
  appId,
  isLoading = false,
  onFileSelect,
}) => {
  const appOptions = listApp.map((a) => ({ value: a.value.toString(), label: a.label }));
  const modulOptions = listModule.map((m) => ({ value: m.value.toString(), label: m.label }));
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90%]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Screenshots</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {!appId && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select App
                </label>
                <ReactSelect
                  isSearchable
                  placeholder="Choose app"
                  options={appOptions}
                  value={appOptions.find((o) => o.value === selectedApp) ?? null}
                  onChange={(opt) => onAppChange(opt?.value ?? "")}
                  styles={reactSelectStyles}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Modul
              </label>
              <ReactSelect
                isSearchable
                placeholder="Choose modul"
                options={modulOptions}
                value={modulOptions.find((o) => o.value === selectedModul) ?? null}
                onChange={(opt) => onModulChange(opt?.value ?? "")}
                styles={reactSelectStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Category
              </label>
              <ReactSelect
                isSearchable
                placeholder="Choose category"
                options={categoryOptions}
                value={categoryOptions.find((o) => o.value === selectedCategory) ?? null}
                onChange={(opt) => onCategoryChange(opt?.value ?? "")}
                styles={reactSelectStyles}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
              <Dropzone
                multiple
                onDrop={onFileSelect}
                accept={FORMAT_INPUT_IMAGE_FILE}
                maxFiles={20}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="w-full" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Click to select images or drop images
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports JPG, PNG, WebP
                    </p>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>

          {bulkFiles.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">
                Selected Files ({bulkFiles.length})
              </h4>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {bulkFiles.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <ImageWithFallback
                          alt={item.file.name}
                          src={getImageUrlFromFile(item.file)}
                          fallbackSrc={getImageUrlFromFile(item.file)}
                          containerClassName="h-10 w-10"
                          className="h-10 w-10 object-cover object-center rounded"
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">
                            {item.file.name} ({formatFileSize(item.file.size)})
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onFilesChange(bulkFiles.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700">
                        Screenshot Name
                      </label>
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const newBulkFiles = [...bulkFiles];
                          newBulkFiles[index] = {
                            ...newBulkFiles[index],
                            name: e.target.value,
                          };
                          onFilesChange(newBulkFiles);
                        }}
                        onClear={() => {
                          const newBulkFiles = [...bulkFiles];
                          newBulkFiles[index] = {
                            ...newBulkFiles[index],
                            name: "",
                          };
                          onFilesChange(newBulkFiles);
                        }}
                        placeholder={
                          "Enter screenshot name (default name: using original name)"
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={
                isLoading ||
                bulkFiles.length === 0 ||
                (!appId && !selectedApp) ||
                !selectedCategory ||
                !selectedModul
              }
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {bulkFiles.length} Screenshots
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
