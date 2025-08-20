import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sliderAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const sliderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().optional(),
});

type SliderForm = z.infer<typeof sliderSchema>;

const Slider = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: sliderItems, isLoading } = useQuery({
    queryKey: ['slider'],
    queryFn: () => sliderAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => sliderAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
      toast.success('Slider item created successfully');
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create slider item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      sliderAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
      toast.success('Slider item updated successfully');
      setEditingSlider(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update slider item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sliderAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
      toast.success('Slider item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete slider item');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => sliderAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
      toast.success('Slider item status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SliderForm>({
    resolver: zodResolver(sliderSchema),
  });

  const onSubmit = async (data: SliderForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (editingSlider) {
      updateMutation.mutate({ id: editingSlider.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (sliderItem: any) => {
    setEditingSlider(sliderItem);
    reset({
      title: sliderItem.title,
      subtitle: sliderItem.subtitle,
      description: sliderItem.description,
      button_text: sliderItem.button_text,
      button_link: sliderItem.button_link,
      sort_order: sliderItem.sort_order,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string) => {
    toggleMutation.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Slider Management</h1>
          <p className="text-muted-foreground">
            Manage homepage slider items and their order
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Slider Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Slider Item</DialogTitle>
              <DialogDescription>
                Create a new slider item for the homepage
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Slider title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  {...register('subtitle')}
                  placeholder="Slider subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Slider description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    {...register('button_text')}
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    {...register('sort_order', { valueAsNumber: true })}
                    placeholder="Display order"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  {...register('button_link')}
                  placeholder="https://..."
                />
                {errors.button_link && (
                  <p className="text-sm text-red-600">{errors.button_link.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Slider Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Recommended size: 1920x1080px or similar aspect ratio
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Slider Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slider Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sliderItems?.data.slider_items?.map((sliderItem: any) => (
          <Card key={sliderItem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{sliderItem.title}</CardTitle>
                  {sliderItem.subtitle && (
                    <CardDescription className="text-sm font-medium">
                      {sliderItem.subtitle}
                    </CardDescription>
                  )}
                  {sliderItem.description && (
                    <CardDescription className="line-clamp-2 mt-1">
                      {sliderItem.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(sliderItem.id)}
                  >
                    {sliderItem.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(sliderItem)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Slider Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{sliderItem.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(sliderItem.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sliderItem.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/slider/${sliderItem.image}`}
                      alt={sliderItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  {sliderItem.button_text && (
                    <Badge variant="secondary">{sliderItem.button_text}</Badge>
                  )}
                  {sliderItem.sort_order && (
                    <Badge variant="outline">Order: {sliderItem.sort_order}</Badge>
                  )}
                  <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                    sliderItem.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sliderItem.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingSlider && (
        <Dialog open={!!editingSlider} onOpenChange={() => setEditingSlider(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Slider Item</DialogTitle>
              <DialogDescription>
                Update slider item information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="Slider title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  {...register('subtitle')}
                  placeholder="Slider subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...register('description')}
                  placeholder="Slider description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-button_text">Button Text</Label>
                  <Input
                    id="edit-button_text"
                    {...register('button_text')}
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sort_order">Sort Order</Label>
                  <Input
                    id="edit-sort_order"
                    type="number"
                    {...register('sort_order', { valueAsNumber: true })}
                    placeholder="Display order"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-button_link">Button Link</Label>
                <Input
                  id="edit-button_link"
                  {...register('button_link')}
                  placeholder="https://..."
                />
                {errors.button_link && (
                  <p className="text-sm text-red-600">{errors.button_link.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Slider Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Recommended size: 1920x1080px or similar aspect ratio
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSlider(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Slider Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Slider;
