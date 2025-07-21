import React, { useState } from 'react';
import { Trophy, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Milestone } from '../../types';
import { formatCurrency } from '../../utils/memberUtils';

const Milestones: React.FC = () => {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    amount: '',
    description: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const milestoneData = {
      age: parseInt(formData.age),
      amount: parseFloat(formData.amount),
      description: formData.description,
      isActive: formData.isActive
    };

    if (editingId) {
      updateMilestone(editingId, milestoneData);
      setEditingId(null);
    } else {
      addMilestone(milestoneData);
    }

    setIsFormOpen(false);
    setFormData({ age: '', amount: '', description: '', isActive: true });
  };

  const handleEdit = (milestone: Milestone) => {
    setFormData({
      age: milestone.age.toString(),
      amount: milestone.amount.toString(),
      description: milestone.description,
      isActive: milestone.isActive
    });
    setEditingId(milestone.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ age: '', amount: '', description: '', isActive: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Milestone Benefits</h1>
          <p className="text-gray-600">Manage age-based benefits for members</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Milestone Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefit Amount (₱) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
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
                  <span>{editingId ? 'Update' : 'Add'} Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones
          .sort((a, b) => a.age - b.age)
          .map((milestone) => (
            <div
              key={milestone.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all hover:shadow-md ${
                milestone.isActive ? 'border-indigo-200' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${milestone.isActive ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  <Trophy className={`h-6 w-6 ${milestone.isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(milestone)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Age {milestone.age}</h3>
                <p className="text-3xl font-bold text-indigo-600 mb-3">
                  {formatCurrency(milestone.amount)}
                </p>
                <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>
                
                <div className="flex justify-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    milestone.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new milestone benefit.</p>
        </div>
      )}

      {/* Information Card */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Milestone Benefits Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Milestone benefits are automatically calculated based on member age</p>
          <p>• Benefits are paid when members reach the specified age milestones</p>
          <p>• Only active milestones are considered for benefit calculations</p>
          <p>• Members must be in good standing to receive milestone benefits</p>
          <p>• Contact the treasurer for benefit claim procedures</p>
        </div>
      </div>
    </div>
  );
};

export default Milestones;