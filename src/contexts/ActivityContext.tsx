import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Activity {
  id: string;
  type: 'member_added' | 'payment_added' | 'status_changed' | 'profile_updated' | 'bulletin_posted' | 'officer_added';
  description: string;
  user: string;
  timestamp: string;
  details?: any;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  getRecentActivities: (limit?: number) => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load activities from localStorage
    const storedActivities = localStorage.getItem('scngmai_activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);

  useEffect(() => {
    // Save activities to localStorage
    localStorage.setItem('scngmai_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep only last 100 activities
  };

  const getRecentActivities = (limit: number = 10) => {
    return activities.slice(0, limit);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity, getRecentActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};