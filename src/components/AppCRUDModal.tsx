import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import ImageWithFallback from "./ui/ImageWithFallback";

interface App {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  company: string;
}

interface AppCRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppCreate: (app: Omit<App, "id">) => void;
  onAppUpdate: (app: App) => void;
  onAppDelete: (id: number) => void;
  editingApp?: App | null;
  userApps: App[];
}

export const AppCRUDModal: React.FC<AppCRUDModalProps> = ({
  isOpen,
  onClose,
  onAppCreate,
  onAppUpdate,
  onAppDelete,
  editingApp,
  userApps,
}) => {
  const [formData, setFormData] = useState({
    name: editingApp?.name || "",
    category: editingApp?.category || "",
    subcategory: editingApp?.subcategory || "",
    platform: editingApp?.platform || ("Both" as const),
    image: editingApp?.image || "",
    description: editingApp?.description || "",
    downloads: editingApp?.downloads || "1K+",
    rating: editingApp?.rating || 4.0,
    tags: editingApp?.tags?.join(", ") || "",
    color: editingApp?.color || "#000000",
    company: editingApp?.company || "",
  });

  const user = useTypedSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage apps.",
        variant: "destructive",
      });
      return;
    }

    const appData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingApp) {
      onAppUpdate({ ...appData, id: editingApp.id });
      toast({
        title: "App Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      onAppCreate(appData);
      toast({
        title: "App Created",
        description: `${formData.name} has been created successfully.`,
      });
    }

    onClose();
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onAppDelete(id);
      toast({
        title: "App Deleted",
        description: `${name} has been deleted successfully.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingApp ? "Edit App" : "Create New App"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">App Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategory: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <Select
                value={formData.platform}
                onValueChange={(value: "iOS" | "Android" | "Both") =>
                  setFormData((prev) => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iOS">iOS</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Downloads
                </label>
                <Input
                  value={formData.downloads}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      downloads: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Design, Mobile, UI/UX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Color
                </label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingApp ? "Update" : "Create"} App
              </Button>
            </div>
          </form>

          {/* My Apps List */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              My Apps ({userApps.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={
                        app?.image ?? "https://source.unsplash.com/400x300?game"
                      }
                      fallbackSrc="https://placehold.co/400"
                      alt={app.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{app.name}</h4>
                      <p className="text-sm text-slate-600">{app.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          name: app.name,
                          category: app.category,
                          subcategory: app.subcategory,
                          platform: app.platform,
                          image: app.image,
                          description: app.description,
                          downloads: app.downloads,
                          rating: app.rating,
                          tags: app.tags.join(", "),
                          color: app.color,
                          company: app.company,
                        });
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(app.id, app.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {userApps.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No apps created yet</p>
                  <p className="text-sm">
                    Create your first app using the form
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
