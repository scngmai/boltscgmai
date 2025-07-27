import React from 'react';
import { Activity, UserPlus, DollarSign, Edit } from 'lucide-react';

const RecentActivity: React.FC = () => {
  // Mock recent activities - in a real app, this would come from an activity log
  const activities = [
    {
      id: '1',
      type: 'payment',
      description: 'Payment received from Juan Dela Cruz',
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'member',
      description: 'New member Maria Santos registered',
      time: '4 hours ago',
      icon: UserPlus,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'update',
      description: 'Member status updated for Pedro Garcia',
      time: '1 day ago',
      icon: Edit,
      color: 'text-yellow-600'
    },
    {
      id: '4',
      type: 'payment',
      description: 'Payment received from Ana Rodriguez',
      time: '2 days ago',
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Activity className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;