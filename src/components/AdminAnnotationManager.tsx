
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Annotation, AnnotationFormData } from '@/types/annotations';

// Mock data
const mockAnnotations: Annotation[] = [
  {
    id: '1',
    screenId: '1',
    appId: 1,
    x: 25,
    y: 30,
    title: 'Navigation Pattern',
    description: 'Bottom tab navigation following iOS Human Interface Guidelines with proper touch targets and visual hierarchy.',
    type: 'ui-pattern',
    category: 'Navigation',
    tags: ['iOS', 'tabs', 'navigation', 'accessibility'],
    createdBy: 'Admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isVisible: true,
    color: '#3B82F6'
  },
  {
    id: '2',
    screenId: '1',
    appId: 1,
    x: 75,
    y: 15,
    title: 'Search Interaction',
    description: 'Search functionality with autocomplete suggestions and recent searches for improved user experience.',
    type: 'interaction',
    category: 'Search',
    tags: ['search', 'autocomplete', 'UX'],
    createdBy: 'Admin',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    isVisible: true,
    color: '#10B981'
  }
];

const annotationTypes = [
  { value: 'ui-pattern', label: 'UI Pattern' },
  { value: 'interaction', label: 'Interaction' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'design', label: 'Design' },
  { value: 'technical', label: 'Technical' }
];

const annotationColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'
];

export const AdminAnnotationManager: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>(mockAnnotations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const { toast } = useToast();

  const form = useForm<AnnotationFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'ui-pattern',
      category: '',
      tags: [],
      isVisible: true,
      color: annotationColors[0]
    }
  });

  const filteredAnnotations = annotations.filter(annotation => {
    const matchesSearch = annotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annotation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         annotation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || annotation.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleSubmit = (data: AnnotationFormData) => {
    if (editingAnnotation) {
      // Update existing annotation
      setAnnotations(prev => prev.map(annotation => 
        annotation.id === editingAnnotation.id 
          ? { ...annotation, ...data, updatedAt: new Date().toISOString() }
          : annotation
      ));
      toast({
        title: "Annotation updated",
        description: "The annotation has been successfully updated.",
      });
    } else {
      // Create new annotation
      const newAnnotation: Annotation = {
        ...data,
        id: Date.now().toString(),
        screenId: '1', // This would be set based on context
        appId: 1, // This would be set based on context
        x: 50, // Default position - would be set via click on image
        y: 50,
        tags: data.tags || [],
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      toast({
        title: "Annotation created",
        description: "The annotation has been successfully created.",
      });
    }

    form.reset();
    setEditingAnnotation(null);
    setIsCreateModalOpen(false);
  };

  const handleEdit = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
    form.reset({
      title: annotation.title,
      description: annotation.description,
      type: annotation.type,
      category: annotation.category,
      tags: annotation.tags,
      isVisible: annotation.isVisible,
      color: annotation.color
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
    toast({
      title: "Annotation deleted",
      description: "The annotation has been successfully deleted.",
    });
  };

  const handleToggleVisibility = (id: string) => {
    setAnnotations(prev => prev.map(annotation => 
      annotation.id === id 
        ? { ...annotation, isVisible: !annotation.isVisible }
        : annotation
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Annotation Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAnnotation(null); form.reset(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Annotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAnnotation ? 'Edit Annotation' : 'Create New Annotation'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter annotation title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the annotation in detail" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {annotationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Navigation, Forms" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          {annotationColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-8 h-8 rounded-full border-2 ${
                                field.value === color ? 'border-gray-900' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isVisible"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Visible to users</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAnnotation ? 'Update' : 'Create'} Annotation
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search annotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {annotationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Annotations List */}
      <div className="grid gap-4">
        {filteredAnnotations.map((annotation) => (
          <Card key={annotation.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: annotation.color }}
                    />
                    <h3 className="font-semibold">{annotation.title}</h3>
                    <Badge variant="outline">{annotation.type.replace('-', ' ')}</Badge>
                    <Badge variant="secondary">{annotation.category}</Badge>
                    {!annotation.isVisible && (
                      <Badge variant="destructive">Hidden</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{annotation.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {annotation.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVisibility(annotation.id)}
                  >
                    {annotation.isVisible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(annotation)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(annotation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnotations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No annotations found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
