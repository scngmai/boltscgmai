import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, CreditCard, FileText, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, getPaymentStatus } from '../../utils/memberUtils';
import { Member, MemberStatus } from '../../types';
import { hasAccess } from '../../utils/roleUtils';

const MemberList: React.FC = () => {
  const { members, updateMember, deleteMember, addPayment } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'delinquent'>('all');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [paymentForm, setPaymentForm] = useState<{ memberId: string; year: number } | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: '780', date: new Date().toISOString().split('T')[0] });

  const currentYear = new Date().getFullYear();
  const last3Years = [currentYear, currentYear - 1, currentYear - 2];
  
  const canEdit = user && hasAccess(user.role, 5); // Edit members
  const canDelete = user && hasAccess(user.role, 5); // Delete members  
  const canAddPayment = user && hasAccess(user.role, 9); // Add payment

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    let matchesPayment = true;
    if (paymentFilter !== 'all') {
      const currentYearStatus = getPaymentStatus(member, currentYear);
      matchesPayment = currentYearStatus.toLowerCase() === paymentFilter;
    }

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember(editingMember.id, editingMember);
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete member "${name}"? This action cannot be undone.`)) {
      deleteMember(id);
    }
  };

  const handleAddPayment = (memberId: string, year: number) => {
    setPaymentForm({ memberId, year });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentForm) {
      addPayment(paymentForm.memberId, paymentForm.year, parseFloat(paymentData.amount), paymentData.date);
      setPaymentForm(null);
      setPaymentData({ amount: '780', date: new Date().toISOString().split('T')[0] });
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-yellow-100 text-yellow-800',
      'Deceased': 'bg-gray-100 text-gray-800',
      'Dropped': 'bg-red-100 text-red-800',
      'Served': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Delinquent': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Deceased">Deceased</option>
              <option value="Dropped">Dropped</option>
              <option value="Served">Served</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'pending' | 'delinquent')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="delinquent">Delinquent</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last 3 Years
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.memberNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{member.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(getPaymentStatus(member, currentYear))}`}>
                        {getPaymentStatus(member, currentYear)}
                      </span>
                      {member.delinquentYears > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          {member.delinquentYears} years delinquent
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {last3Years.map(year => {
                          const status = getPaymentStatus(member, year);
                          return (
                            <div
                              key={year}
                              className={`w-3 h-3 rounded-full cursor-pointer ${
                                status === 'Paid' ? 'bg-green-400' :
                                status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              title={`${year}: ${status}`}
                              onClick={() => canAddPayment && status !== 'Paid' && handleAddPayment(member.id, year)}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.registrationYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900" 
                          title="View Details"
                          onClick={() => alert(`Member Details:\n\nName: ${member.name}\nID: ${member.memberNumber}\nStatus: ${member.status}\nEmail: ${member.email || 'N/A'}\nPhone: ${member.phone || 'N/A'}\nAddress: ${member.address || 'N/A'}\nRegistered: ${member.registrationYear}\nDelinquent Years: ${member.delinquentYears}\nTotal Due: ${formatCurrency(member.totalDelinquentAmount)}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && (
                          <button 
                            className="text-green-600 hover:text-green-900" 
                            title="Edit Member"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canAddPayment && (
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            title="Add Payment"
                            onClick={() => handleAddPayment(member.id, currentYear)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          className="text-purple-600 hover:text-purple-900" 
                          title="Generate Certificate"
                          onClick={() => alert(`Certificate generated for ${member.name} (${member.memberNumber})`)}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        {canDelete && (
                          <button 
                            className="text-red-600 hover:text-red-900" 
                            title="Delete Member"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredMembers.length} of {members.length} members</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Paid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Delinquent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Member</h2>
              <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({...editingMember, status: e.target.value as MemberStatus})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deceased">Deceased</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Served">Served</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editingMember.address || ''}
                    onChange={(e) => setEditingMember({...editingMember, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {paymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Payment</h2>
              <button onClick={() => setPaymentForm(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={paymentForm.year}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                <input
                  type="date"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setPaymentForm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Add Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberList;