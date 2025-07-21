import React from 'react';
import { Calendar, Gift } from 'lucide-react';
import { Member } from '../../types';

interface BirthdayCelebrantsProps {
  celebrants: Member[];
}

const BirthdayCelebrants: React.FC<BirthdayCelebrantsProps> = ({ celebrants }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Gift className="h-5 w-5 text-pink-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Birthday Celebrants</h3>
      </div>

      {celebrants.length > 0 ? (
        <div className="space-y-3">
          {celebrants.map((member) => (
            <div key={member.id} className="flex items-center p-3 bg-pink-50 rounded-lg">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-pink-800">
                  {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.memberNumber}</p>
              </div>
              <div className="text-right">
                <Calendar className="h-4 w-4 text-pink-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No birthdays today</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayCelebrants;