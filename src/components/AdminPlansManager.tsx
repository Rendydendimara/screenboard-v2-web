import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminPlansAPI from "@/api/admin/plans/api";
import { TPlan, TCreatePlan, TUpdatePlan } from "@/api/admin/plans/type";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "./ui/switch";
import { Skeleton } from "./ui/skeleton";

export const AdminPlansManager = () => {
  const [plans, setPlans] = useState<TPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TPlan | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState<TCreatePlan>({
    name: "",
    slug: "pro",
    description: "",
    price: 0,
    currency: "usd",
    interval: "month",
    stripePriceId: "",
    stripeProductId: "",
    features: [],
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoadingFetch(true);
      const response = await AdminPlansAPI.getList();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch plans",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFetch(false);
    }
  };

  const handleOpenModal = (plan?: TPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        features: plan.features,
        isActive: plan.isActive,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        slug: "pro",
        description: "",
        price: 0,
        currency: "usd",
        interval: "month",
        stripePriceId: "",
        stripeProductId: "",
        features: [],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setFeatureInput("");
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.stripePriceId ||
      !formData.stripeProductId
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingPlan) {
        const updateData: TUpdatePlan = { ...formData };
        const response = await AdminPlansAPI.update(
          editingPlan._id,
          updateData
        );
        if (response.success) {
          toast({
            title: "Success",
            description: "Plan updated successfully",
          });
          fetchPlans();
          handleCloseModal();
        }
      } else {
        const response = await AdminPlansAPI.create(formData);
        if (response.success) {
          toast({
            title: "Success",
            description: "Plan created successfully",
          });
          fetchPlans();
          handleCloseModal();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (plan: TPlan) => {
    if (!confirm(`Are you sure you want to delete ${plan.name}?`)) {
      return;
    }

    try {
      const response = await AdminPlansAPI.delete(plan._id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Plan deleted successfully",
        });
        fetchPlans();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription Plans</CardTitle>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingFetch
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : plans.map((plan) => (
                    <TableRow key={plan._id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.slug}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {plan.price.toFixed(2)} {plan.currency.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell>{plan.interval}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {plan.features.length} features
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {plan.isActive ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(plan)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(plan)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onClear={() => setFormData({ ...formData, name: "" })}
                  placeholder="e.g. Screenboard Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Select
                  value={formData.slug}
                  onValueChange={(value: "pro" | "business") =>
                    setFormData({ ...formData, slug: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Plan description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                  onClear={() => setFormData({ ...formData, price: 0 })}
                  placeholder="19.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  onClear={() => setFormData({ ...formData, currency: "" })}
                  placeholder="usd"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Interval</Label>
                <Select
                  value={formData.interval}
                  onValueChange={(value: "month" | "year") =>
                    setFormData({ ...formData, interval: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripePriceId">Stripe Price ID *</Label>
              <Input
                id="stripePriceId"
                value={formData.stripePriceId}
                onChange={(e) =>
                  setFormData({ ...formData, stripePriceId: e.target.value })
                }
                onClear={() => setFormData({ ...formData, stripePriceId: "" })}
                placeholder="price_xxxxxxxxxxxxx"
              />
              <p className="text-xs text-gray-500">
                Get this from your Stripe Dashboard → Products → Price ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripeProductId">Stripe Product ID *</Label>
              <Input
                id="stripeProductId"
                value={formData.stripeProductId}
                onChange={(e) =>
                  setFormData({ ...formData, stripeProductId: e.target.value })
                }
                onClear={() =>
                  setFormData({ ...formData, stripeProductId: "" })
                }
                placeholder="prod_xxxxxxxxxxxxx"
              />
              <p className="text-xs text-gray-500">
                Get this from your Stripe Dashboard → Products → Product ID
              </p>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onClear={() => setFeatureInput("")}
                  placeholder="Enter a feature"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddFeature}>
                  Add
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {formData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : editingPlan ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlansManager;
