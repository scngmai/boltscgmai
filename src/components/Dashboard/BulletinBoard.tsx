import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { BulletinPost } from '../../types';
import { hasAccess } from '../../utils/roleUtils';

interface BulletinBoardProps {
  posts: BulletinPost[];
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ posts }) => {
  const { addBulletinPost, updateBulletinPost, deleteBulletinPost } = useData();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BulletinPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const canManageBulletin = user && hasAccess(user.role, 15); // Post Bulletin Updates

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      updateBulletinPost(editingPost.id, {
        ...formData,
        author: user?.name || 'Unknown'
      });
    } else {
      addBulletinPost({
        ...formData,
        author: user?.name || 'Unknown',
        date: new Date().toISOString().split('T')[0],
        isActive: true
      });
    }

    handleCancel();
  };

  const handleEdit = (post: BulletinPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bulletin post?')) {
      deleteBulletinPost(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
    setFormData({ title: '', content: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Bulletin Board</h3>
          </div>
          {canManageBulletin && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Add New Post"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>By {post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {canManageBulletin && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No announcements yet</p>
              {canManageBulletin && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Post the first announcement
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            View all announcements
          </button>
        </div>
      </div>

      {/* Bulletin Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPost ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement content"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPost ? 'Update' : 'Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BulletinBoard;