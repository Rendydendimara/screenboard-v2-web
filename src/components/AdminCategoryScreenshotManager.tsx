import ScreenCategoryAPI from "@/api/admin/screenCategory/api";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";

export interface Screenshot {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  appId?: string;
  colors?: Array<{
    hex: string;
    rgb: { r: number; g: number; b: number };
    percentage: number;
  }>;
  modul: string;
  dominantColor?: string;
}

interface FormDataCategory {
  name: string;
}

export const AdminCategoryScreenshotManager = () => {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<TScreenCategoryRes | null>(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataCategory, setFormDataCategory] = useState<FormDataCategory>({
    name: "",
  });
  const [categories, setCategories] = useState<TScreenCategoryRes[]>([]);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingGet, setisLoadingGet] = useState(false);
  const { toast } = useToast();

  const handleCreateCategory = () => {
    resetFormCategory();
    setIsModalOpen(true);
  };

  const resetFormCategory = () => {
    setFormDataCategory({
      name: "",
    });
    setEditingCategory(null);
  };

  const handleEditCategory = (category: TScreenCategoryRes) => {
    setFormDataCategory({
      name: category.name,
    });
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((d) => d._id.toString() === id);
    if (category) {
      setEditingCategory(category);
      setIsModalOpenDelete(true);
    }
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingCategory(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      await ScreenCategoryAPI.remove(editingCategory._id);
      toast({
        title: "Category Deleted",
        description: `${editingCategory.name} has been deleted successfully.`,
      });
      getListDataCategory();
      handleCloseModalDelete();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }, [editingCategory]);

  const getListDataCategory = async () => {
    try {
      setisLoadingGet(true);
      const dataRes = await ScreenCategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });

      setisLoadingGet(false);
    } finally {
      setisLoadingGet(false);
    }
  };

  const handleCloseModalForm = () => {
    setIsModalOpen(false);
    resetFormCategory();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      const appData = {
        ...formDataCategory,
      };
      if (editingCategory) {
        await ScreenCategoryAPI.update({
          name: appData.name,
          categoryId: editingCategory._id,
        });

        toast({
          title: "Category Updated",
          description: `${formDataCategory.name} has been updated successfully.`,
        });
      } else {
        await ScreenCategoryAPI.create({
          name: appData.name,
        });

        toast({
          title: "Category Created",
          description: `${formDataCategory.name} has been created successfully.`,
        });
      }
      getListDataCategory();
      setIsModalOpen(false);
      resetFormCategory();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const disabledButtonForm = useMemo(() => {
    if (isLoadingPost) return true;
    const { name } = formDataCategory;

    return !name.trim();
  }, [formDataCategory]);

  useEffect(() => {
    getListDataCategory();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Screenshot Category Management</CardTitle>
            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Screenshot Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-4">
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div> */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingGet
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : categories.map((category) => (
                      <TableRow
                        key={category._id}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCategory(category);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category._id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModalForm}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90%]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? "Edit Screenshot Category"
                : "Create New Screenshot Category"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formDataCategory.name}
                  onChange={(e) =>
                    setFormDataCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  onClear={() =>
                    setFormDataCategory((prev) => ({
                      ...prev,
                      name: "",
                    }))
                  }
                  required
                />
              </div>
            </>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModalForm}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={disabledButtonForm}>
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={handleCloseModalDelete}
        onConfirm={handleConfirmDelete}
        isLoadingAction={isLoadingDelete}
        customerName="Category"
      />
    </div>
  );
};
