import React from 'react';
import { 
  Home, 
  UserPlus, 
  Users, 
  FileText, 
  User, 
  Trophy, 
  Settings,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { canViewTab } from '../../utils/roleUtils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'registration', name: 'Registration', icon: UserPlus },
    { id: 'officers', name: 'Officers', icon: Users },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'milestones', name: 'Milestones', icon: Trophy },
    { id: 'user-management', name: 'User Management', icon: Settings }
  ];

  const visibleTabs = tabs.filter(tab => canViewTab(user.role, tab.id));

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;