import React from 'react';
import { Users, UserCheck, AlertTriangle, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, getBirthdayCelebrants } from '../../utils/memberUtils';
import BirthdayCelebrants from './BirthdayCelebrants';
import BulletinBoard from './BulletinBoard';
import RecentActivity from './RecentActivity';
import SummaryCards from './SummaryCards';

const Dashboard: React.FC = () => {
  const { members, bulletinPosts } = useData();
  const { user } = useAuth();

  const activeMembers = members.filter(m => m.status === 'Active');
  const delinquentMembers = members.filter(m => m.delinquentYears > 0);
  const totalDelinquentAmount = delinquentMembers.reduce((sum, m) => sum + m.totalDelinquentAmount, 0);
  const totalAnnualFees = members.length * 780;
  const birthdayCelebrants = getBirthdayCelebrants(members);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-indigo-100">
          Here's what's happening with SCNGMAI today.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Birthday Celebrants */}
        <div className="lg:col-span-1">
          <BirthdayCelebrants celebrants={birthdayCelebrants} />
        </div>

        {/* Middle Column - Bulletin Board */}
        <div className="lg:col-span-1">
          <BulletinBoard posts={bulletinPosts.filter(p => p.isActive).slice(0, 3)} />
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Members</p>
              <p className="text-lg font-semibold text-gray-900">{activeMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Delinquent Members</p>
              <p className="text-lg font-semibold text-gray-900">{delinquentMembers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Collectibles</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalDelinquentAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-lg font-semibold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;