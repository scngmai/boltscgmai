import React from 'react';
import { Activity, UserPlus, DollarSign, Edit, MessageSquare, Trophy, Users, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const RecentActivity: React.FC = () => {
  const { activityLogs } = useData();

  const getActivityIcon = (action: string) => {
    if (action.includes('payment')) return DollarSign;
    if (action.includes('member_add')) return UserPlus;
    if (action.includes('member')) return Edit;
    if (action.includes('bulletin')) return MessageSquare;
    if (action.includes('milestone')) return Trophy;
    if (action.includes('officer')) return Users;
    if (action.includes('delete')) return Trash2;
    return Activity;
  };

  const getActivityColor = (action: string) => {
    if (action.includes('payment')) return 'text-green-600';
    if (action.includes('add')) return 'text-blue-600';
    if (action.includes('update')) return 'text-yellow-600';
    if (action.includes('delete')) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Activity className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activityLogs.slice(0, 10).map((activity) => {
          const Icon = getActivityIcon(activity.action);
          const color = getActivityColor(activity.action);
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>By {activity.user_name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(activity.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {activityLogs.length === 0 && (
          <div className="text-center py-4">
            <Activity className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No recent activity</p>
          </div>
        )}
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