import React from 'react';
import { Activity, UserPlus, DollarSign, Edit, UserCheck, MessageSquare, Users } from 'lucide-react';
import { useActivity } from '../../contexts/ActivityContext';

const RecentActivity: React.FC = () => {
  const { getRecentActivities } = useActivity();
  const recentActivities = getRecentActivities(5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_added':
        return { icon: UserPlus, color: 'text-blue-600' };
      case 'payment_added':
        return { icon: DollarSign, color: 'text-green-600' };
      case 'status_changed':
        return { icon: UserCheck, color: 'text-yellow-600' };
      case 'profile_updated':
        return { icon: Edit, color: 'text-purple-600' };
      case 'bulletin_posted':
        return { icon: MessageSquare, color: 'text-indigo-600' };
      case 'officer_added':
        return { icon: Users, color: 'text-orange-600' };
      default:
        return { icon: Activity, color: 'text-gray-600' };
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return activityTime.toLocaleDateString();
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
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => {
            const { icon: Icon, color } = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>by {activity.user}</span>
                    <span>•</span>
                    <span>{getTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No recent activity</p>
            <p className="text-xs text-gray-400">Activities will appear here as you use the system</p>
          </div>
        ))}
      </div>

      {recentActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
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