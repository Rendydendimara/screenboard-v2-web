import React, { useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactSelect from "react-select";
import { TSelect, UploadImageType } from "@/types";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { FORMAT_INPUT_IMAGE_FILE } from "@/constant/app";
import AdminPanelWrapperInputImage from "@/components/ui/AdminPanelWrapperInputImage";
import CInputFileDragDrop, {
  CInputFilePreview,
} from "@/components/ui/CInputFileDragDrop";
import { FormData } from "./types";

const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "6px",
    borderColor: "#e2e8f0",
    fontSize: "14px",
  }),
};

interface AddScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string) => void;
  image: UploadImageType;
  onDropImage: (file: File) => void;
  onEditImage: () => void;
  onRemoveImage: () => void;
  listApp: TSelect[];
  listModule: TSelect[];
  categories: TScreenCategoryRes[];
  appId?: string;
}

export const AddScreenshotModal: React.FC<AddScreenshotModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  image,
  onDropImage,
  onEditImage,
  onRemoveImage,
  listApp,
  listModule,
  categories,
  appId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getImagePreview = useMemo(() => {
    if (image.currentImage) {
      return URL.createObjectURL(image.currentImage);
    }
    if (image.isHaveChange === false && image.oldImage) {
      return image.oldImage;
    }
    return "";
  }, [image]);

  const appOptions = listApp.map((a) => ({ value: a.value.toString(), label: a.label }));
  const modulOptions = listModule.map((m) => ({ value: m.value.toString(), label: m.label }));
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[90%] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Screenshot</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {!appId && (
            <div>
              <label className="block text-sm font-medium mb-2">App</label>
              <ReactSelect
                isSearchable
                placeholder="Select app"
                options={appOptions}
                value={appOptions.find((o) => o.value === formData.appId) ?? null}
                onChange={(opt) => onFormChange("appId", opt?.value ?? "")}
                styles={reactSelectStyles}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Modul</label>
            <ReactSelect
              isSearchable
              placeholder="Select modul"
              options={modulOptions}
              value={modulOptions.find((o) => o.value === formData.module) ?? null}
              onChange={(opt) => onFormChange("module", opt?.value ?? "")}
              styles={reactSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <ReactSelect
              isSearchable
              placeholder="Select category"
              options={categoryOptions}
              value={categoryOptions.find((o) => o.value === formData.category) ?? null}
              onChange={(opt) => onFormChange("category", opt?.value ?? "")}
              styles={reactSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              rows={6}
              value={formData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Screenshot Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              placeholder={
                "Enter screenshot name (default name: using original name)"
              }
              onClear={() => onFormChange("name", "")}
            />
          </div>
          <AdminPanelWrapperInputImage>
            <CInputFileDragDrop
              isRequired
              handleDrop={onDropImage}
              labelForm="Screenshots"
              labelBtn="Browse"
              acceptFile={FORMAT_INPUT_IMAGE_FILE}
              inputRef={fileInputRef}
            />
            <CInputFilePreview
              src={getImagePreview}
              labelForm="Preview"
              onEdit={onEditImage}
              onRemove={onRemoveImage}
            />
          </AdminPanelWrapperInputImage>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Screenshot</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
