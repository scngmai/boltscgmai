import React from 'react';
import { Users, Mail, Phone, Edit, Plus, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasAccess } from '../../utils/roleUtils';

const Officers: React.FC = () => {
  const { officers, members, addOfficer, updateOfficer, deleteOfficer } = useData();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    memberId: ''
  });

  const canEdit = user && (hasAccess(user.role, 8) || user.role === 'Admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find member data if memberId is provided
    const member = formData.memberId ? members.find(m => m.memberNumber === formData.memberId) : null;
    
    const officerData = {
      name: member ? member.name : formData.name,
      position: formData.position,
      email: member ? member.email : formData.email,
      phone: member ? member.phone : formData.phone,
      memberId: formData.memberId || undefined
    };

    if (editingId) {
      updateOfficer(editingId, officerData);
    } else {
      addOfficer(officerData);
    }

    handleCancel();
  };

  const handleEdit = (officer: any) => {
    setFormData({
      name: officer.name,
      position: officer.position,
      email: officer.email || '',
      phone: officer.phone || '',
      memberId: officer.memberId || ''
    });
    setEditingId(officer.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this officer?')) {
      deleteOfficer(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      position: '',
      email: '',
      phone: '',
      memberId: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill member data when member ID is selected
    if (name === 'memberId' && value) {
      const member = members.find(m => m.memberNumber === value);
      if (member) {
        setFormData(prev => ({
          ...prev,
          name: member.name,
          email: member.email || '',
          phone: member.phone || ''
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Association Officers</h1>
          <p className="text-gray-600">Current officers and board members</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Officer</span>
          </button>
        )}
      </div>

      {/* Officer Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Officer' : 'Add New Officer'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Member (Optional)
                </label>
                <select
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a member or enter manually</option>
                  {members.map(member => (
                    <option key={member.id} value={member.memberNumber}>
                      {member.name} ({member.memberNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select position</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Public Information Officer">Public Information Officer</option>
                  <option value="Board Member">Board Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+63 912 345 6789"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingId ? 'Update' : 'Add'} Officer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                {officer.memberId && (
                  <p className="text-xs text-gray-500">Member ID: {officer.memberId}</p>
                )}
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

            {canEdit && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                <button
                  onClick={() => handleEdit(officer)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(officer.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {officers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No officers assigned</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding association officers.</p>
          {canEdit && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add First Officer
            </button>
          )}
        </div>
      )}

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