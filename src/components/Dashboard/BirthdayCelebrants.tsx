import React from 'react';
import { Calendar, Gift, User } from 'lucide-react';
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
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
                {member.profilePicture ? (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-pink-600" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.memberNumber}</p>
                {member.dateOfBirth && (
                  <p className="text-xs text-pink-600">
                    🎂 {new Date(member.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="text-right">
                <Gift className="h-5 w-5 text-pink-500" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Gift className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No birthdays today</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayCelebrants;