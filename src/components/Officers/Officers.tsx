import React from 'react';
import { Users, Mail, Phone, Edit } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const Officers: React.FC = () => {
  const { officers } = useData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Association Officers</h1>
          <p className="text-gray-600">Current officers and board members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((officer) => (
          <div key={officer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                {officer.profilePicture ? (
                  <img
                    src={officer.profilePicture}
                    alt={officer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-indigo-600">
                    {officer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{officer.name}</h3>
                <p className="text-sm font-medium text-indigo-600">{officer.position}</p>
              </div>
            </div>

            <div className="space-y-2">
              {officer.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${officer.email}`} className="hover:text-indigo-600">
                    {officer.email}
                  </a>
                </div>
              )}
              {officer.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${officer.phone}`} className="hover:text-indigo-600">
                    {officer.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit Officer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Officer Responsibilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Executive Officers</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• President: Overall leadership and strategic direction</li>
              <li>• Vice President: Assists president and leads committees</li>
              <li>• Secretary: Records meetings and manages correspondence</li>
              <li>• Treasurer: Financial management and reporting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Board Members</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Auditor: Financial oversight and compliance</li>
              <li>• PIO: Public relations and communications</li>
              <li>• Board of Directors: Governance and policy decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Officers;