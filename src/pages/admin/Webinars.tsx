import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webinarsAPI } from '@/lib/api';
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
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const webinarSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().optional(),
  speaker: z.string().optional(),
  registration_link: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().optional(),
  featured: z.boolean().optional(),
});

type WebinarForm = z.infer<typeof webinarSchema>;

const Webinars = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: webinars, isLoading } = useQuery({
    queryKey: ['webinars'],
    queryFn: () => webinarsAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => webinarsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar created successfully');
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create webinar');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      webinarsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar updated successfully');
      setEditingWebinar(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update webinar');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => webinarsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete webinar');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => webinarsAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      toast.success('Webinar status updated');
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
  } = useForm<WebinarForm>({
    resolver: zodResolver(webinarSchema),
  });

  const onSubmit = async (data: WebinarForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (editingWebinar) {
      updateMutation.mutate({ id: editingWebinar.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (webinar: any) => {
    setEditingWebinar(webinar);
    reset({
      title: webinar.title,
      description: webinar.description,
      date: webinar.date,
      time: webinar.time,
      duration: webinar.duration,
      speaker: webinar.speaker,
      registration_link: webinar.registration_link,
      sort_order: webinar.sort_order,
      featured: webinar.featured,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string) => {
    toggleMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Webinars</h1>
          <p className="text-muted-foreground">
            Manage your webinar events and schedules
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Webinar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Webinar</DialogTitle>
              <DialogDescription>
                Schedule a new webinar event
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Webinar title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Webinar description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    {...register('duration')}
                    placeholder="e.g., 90 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speaker">Speaker</Label>
                  <Input
                    id="speaker"
                    {...register('speaker')}
                    placeholder="Speaker name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_link">Registration Link</Label>
                <Input
                  id="registration_link"
                  {...register('registration_link')}
                  placeholder="https://..."
                />
                {errors.registration_link && (
                  <p className="text-sm text-red-600">{errors.registration_link.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Webinar Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" {...register('featured')} />
                <Label htmlFor="featured">Featured Webinar</Label>
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
                  {createMutation.isPending ? 'Creating...' : 'Create Webinar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webinars Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {webinars?.data.webinars?.map((webinar: any) => (
          <Card key={webinar.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{webinar.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {webinar.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(webinar.id)}
                  >
                    {webinar.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(webinar)}
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
                        <AlertDialogTitle>Delete Webinar</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{webinar.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(webinar.id)}
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(webinar.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{webinar.time}</span>
                </div>
                {webinar.duration && (
                  <Badge variant="secondary">{webinar.duration}</Badge>
                )}
                {webinar.speaker && (
                  <Badge variant="outline">{webinar.speaker}</Badge>
                )}
                {webinar.featured && (
                  <Badge variant="default" className="bg-yellow-600">
                    Featured
                  </Badge>
                )}
                <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                  webinar.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {webinar.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingWebinar && (
        <Dialog open={!!editingWebinar} onOpenChange={() => setEditingWebinar(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Webinar</DialogTitle>
              <DialogDescription>
                Update webinar information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  {...register('title')}
                  placeholder="Webinar title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...register('description')}
                  placeholder="Webinar description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    {...register('time')}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    {...register('duration')}
                    placeholder="e.g., 90 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-speaker">Speaker</Label>
                  <Input
                    id="edit-speaker"
                    {...register('speaker')}
                    placeholder="Speaker name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-registration_link">Registration Link</Label>
                <Input
                  id="edit-registration_link"
                  {...register('registration_link')}
                  placeholder="https://..."
                />
                {errors.registration_link && (
                  <p className="text-sm text-red-600">{errors.registration_link.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Webinar Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="edit-featured" {...register('featured')} />
                <Label htmlFor="edit-featured">Featured Webinar</Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingWebinar(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Webinar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Webinars;
