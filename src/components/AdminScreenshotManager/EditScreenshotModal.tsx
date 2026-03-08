import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { TSelect } from "@/types";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { EditFormData } from "./types";

const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: "40px",
    borderRadius: "6px",
    borderColor: "#e2e8f0",
    fontSize: "14px",
  }),
};

interface EditScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: EditFormData;
  onFormChange: (field: keyof EditFormData, value: string) => void;
  listApp: TSelect[];
  listModule: TSelect[];
  categories: TScreenCategoryRes[];
  appId?: string;
  isLoading?: boolean;
}

export const EditScreenshotModal: React.FC<EditScreenshotModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  listApp,
  listModule,
  categories,
  appId,
  isLoading = false,
}) => {
  const appOptions = listApp.map((a) => ({ value: a.value.toString(), label: a.label }));
  const modulOptions = listModule.map((m) => ({ value: m.value.toString(), label: m.label }));
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[90%] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Screenshot</DialogTitle>
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

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Screenshot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
