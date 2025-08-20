import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesAPI } from '@/lib/api';
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
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().optional(),
  level: z.string().optional(),
  registration_link: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().optional(),
  featured: z.boolean().optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

const Courses = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => coursesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
      setIsCreateDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create course');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      coursesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
      setEditingCourse(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update course');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete course');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => coursesAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course status updated');
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
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseForm) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    reset({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      registration_link: course.registration_link,
      sort_order: course.sort_order,
      featured: course.featured,
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
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and training programs
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course for your academy
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Course title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    {...register('duration')}
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Course description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    {...register('level')}
                    placeholder="e.g., Beginner, Intermediate"
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
                <Label htmlFor="image">Course Image</Label>
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
                <Label htmlFor="featured">Featured Course</Label>
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
                  {createMutation.isPending ? 'Creating...' : 'Create Course'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses?.data.courses?.map((course: any) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(course.id)}
                  >
                    {course.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(course)}
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
                        <AlertDialogTitle>Delete Course</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{course.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(course.id)}
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
                {course.duration && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{course.duration}</Badge>
                  </div>
                )}
                {course.level && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                )}
                {course.featured && (
                  <Badge variant="default" className="bg-yellow-600">
                    Featured
                  </Badge>
                )}
                <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                  course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Same form fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    {...register('title')}
                    placeholder="Course title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    {...register('duration')}
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...register('description')}
                  placeholder="Course description"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Input
                    id="edit-level"
                    {...register('level')}
                    placeholder="e.g., Beginner, Intermediate"
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
                <Label htmlFor="edit-image">Course Image</Label>
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
                <Label htmlFor="edit-featured">Featured Course</Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCourse(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Course'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Courses;
