import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesAPI, webinarsAPI, sliderAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Image, Users, TrendingUp, Eye } from 'lucide-react';

interface DashboardStats {
  courses: number;
  webinars: number;
  sliderItems: number;
  totalViews?: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    courses: 0,
    webinars: 0,
    sliderItems: 0,
  });

  // Fetch data for dashboard
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesAPI.getAll(),
  });

  const { data: webinars } = useQuery({
    queryKey: ['webinars'],
    queryFn: () => webinarsAPI.getAll(),
  });

  const { data: sliderItems } = useQuery({
    queryKey: ['slider'],
    queryFn: () => sliderAPI.getAll(),
  });

  useEffect(() => {
    if (courses && webinars && sliderItems) {
      setStats({
        courses: courses.data.courses?.length || 0,
        webinars: webinars.data.webinars?.length || 0,
        sliderItems: sliderItems.data.slider_items?.length || 0,
      });
    }
  }, [courses, webinars, sliderItems]);

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.courses,
      description: 'Active courses',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Webinars',
      value: stats.webinars,
      description: 'Scheduled webinars',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Slider Items',
      value: stats.sliderItems,
      description: 'Active slider items',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Views',
      value: '2.5K+',
      description: 'Website visitors',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the JLT Academy admin panel. Here's an overview of your content.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>
              Latest courses added to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses?.data.courses?.slice(0, 5).map((course: any) => (
              <div key={course.id} className="flex items-center space-x-4 py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Webinars</CardTitle>
            <CardDescription>
              Latest webinars scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {webinars?.data.webinars?.slice(0, 5).map((webinar: any) => (
              <div key={webinar.id} className="flex items-center space-x-4 py-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{webinar.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(webinar.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  webinar.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {webinar.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Add Course</p>
                <p className="text-sm text-muted-foreground">Create a new course</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Schedule Webinar</p>
                <p className="text-sm text-muted-foreground">Plan a new webinar</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Image className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Update Slider</p>
                <p className="text-sm text-muted-foreground">Manage homepage slider</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
