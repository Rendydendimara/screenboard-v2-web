
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Smartphone, Image } from 'lucide-react';

export const AdminStats: React.FC = () => {
  const stats = [
    {
      title: "Total Apps",
      value: "247",
      icon: Smartphone,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Total Screenshots",
      value: "1,823",
      icon: Image,
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Active Users",
      value: "12,456",
      icon: Users,
      change: "+24%",
      changeType: "positive" as const
    },
    {
      title: "Monthly Views",
      value: "89,234",
      icon: BarChart3,
      change: "+15%",
      changeType: "positive" as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">New app "WhatsApp Business" added</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">15 screenshots uploaded for Instagram</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">App "TikTok" updated with new details</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Bulk upload completed: 25 screenshots</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">45</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Entertainment</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/5 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">32</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Productivity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-2/5 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">28</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Finance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/4 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">19</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
