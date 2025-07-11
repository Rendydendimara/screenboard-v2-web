import ModulAPI from "@/api/admin/modul/api";
import { TModulRes } from "@/api/admin/modul/type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";

interface IModul {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
}

export const AdminModuleManager: React.FC = () => {
  const [moduls, setModuls] = useState<IModul[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModul, setEditingModul] = useState<IModul | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingGet, setisLoadingGet] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
    });
    setEditingModul(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (app: IModul) => {
    setFormData({
      name: app.name,
    });
    setEditingModul(app);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      if (editingModul) {
        await ModulAPI.update({
          name: formData.name,
          modulId: editingModul._id,
        });
        toast({
          title: "Modul Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await ModulAPI.create({
          name: formData.name,
        });
        toast({
          title: "Modul Created",
          description: `${formData.name} has been created successfully.`,
        });
      }
      // Reset form
      setIsModalOpen(false);
      resetForm();
      getListData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleDelete = (id: string) => {
    const modul = moduls.find((d) => d._id === id);
    if (modul) {
      setEditingModul(modul);
      setIsModalOpenDelete(true);
    }
  };

  const filteredApps = moduls.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getListData = async () => {
    try {
      setisLoadingGet(true);
      const dataRes = await ModulAPI.getAll();
      const data: TModulRes[] = dataRes.data;
      const dataTemp: IModul[] = data.map((d) => {
        return {
          _id: d._id,
          name: d.name,
        };
      });
      setModuls(dataTemp);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });

      setisLoadingGet(false);
    } finally {
      setisLoadingGet(false);
      // finally
    }
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingModul(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      await ModulAPI.remove(editingModul._id);
      toast({
        title: "Modul Deleted",
        description: `${editingModul.name} has been deleted successfully.`,
      });

      getListData();
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
  }, [editingModul]);

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modul Management</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Modul
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search modul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow
                    key={app._id}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <TableCell>
                      <div className="font-medium">{app.name}</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(app);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(app._id);
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingModul ? "Edit Modul" : "Create New Modul"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoadingPost}>
                <Save className="h-4 w-4 mr-2" />
                {editingModul ? "Update" : "Create"} Modul
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
        customerName={editingModul?.name ?? ""}
      />
    </div>
  );
};
