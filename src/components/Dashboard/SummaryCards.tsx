import React from 'react';
import { Users, UserCheck, AlertTriangle, DollarSign, UserX, Heart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../utils/memberUtils';

const SummaryCards: React.FC = () => {
  const { members } = useData();

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const inactiveMembers = members.filter(m => m.status === 'Inactive').length;
  const deceasedMembers = members.filter(m => m.status === 'Deceased').length;
  const droppedMembers = members.filter(m => m.status === 'Dropped').length;
  const servedMembers = members.filter(m => m.status === 'Served').length;
  
  const delinquentMembers = members.filter(m => m.delinquentYears > 0);
  const totalDelinquentYears = delinquentMembers.reduce((sum, m) => sum + m.delinquentYears, 0);
  const totalCollectibles = delinquentMembers.reduce((sum, m) => sum + m.totalDelinquentAmount, 0);
  const totalAnnualFees = members.length * 780;

  const cards = [
    {
      title: 'Total Members',
      value: totalMembers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Members',
      value: activeMembers,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Inactive Members',
      value: inactiveMembers,
      icon: UserX,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Deceased Members',
      value: deceasedMembers,
      icon: Heart,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    },
    {
      title: 'Dropped Members',
      value: droppedMembers,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Served Members',
      value: servedMembers,
      icon: Heart,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Delinquent Years',
      value: totalDelinquentYears,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Collectibles',
      value: formatCurrency(totalCollectibles),
      icon: DollarSign,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      isAmount: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.isAmount ? card.value : card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;