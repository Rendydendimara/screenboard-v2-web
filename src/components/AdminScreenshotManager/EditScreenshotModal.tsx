import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TSelect } from "@/types";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { EditFormData } from "./types";

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
              <Select
                value={formData.appId}
                onValueChange={(value) => onFormChange("appId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select app" />
                </SelectTrigger>
                <SelectContent>
                  {listApp.map((app) => (
                    <SelectItem key={app.value} value={app.value.toString()}>
                      {app.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Modul</label>
            <Select
              value={formData.module}
              onValueChange={(value) => onFormChange("module", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select modul" />
              </SelectTrigger>
              <SelectContent>
                {listModule.map((modul) => (
                  <SelectItem key={modul.value} value={modul.value}>
                    {modul.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => onFormChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
