import React, { useState } from 'react';
import Header from './Layout/Header';
import Navigation from './Layout/Navigation';
import Dashboard from './Dashboard/Dashboard';
import Registration from './Registration/Registration';
import Officers from './Officers/Officers';
import Reports from './Reports/Reports';
import Profile from './Profile/Profile';
import Milestones from './Milestones/Milestones';
import UserManagement from './UserManagement/UserManagement';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'registration':
        return <Registration />;
      case 'officers':
        return <Officers />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      case 'milestones':
        return <Milestones />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;