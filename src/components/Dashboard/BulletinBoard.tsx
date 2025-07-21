import React from 'react';
import { MessageSquare, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { BulletinPost } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasAccess } from '../../utils/roleUtils';

interface BulletinBoardProps {
  posts: BulletinPost[];
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ posts }) => {
  const { addBulletinPost, updateBulletinPost, deleteBulletinPost } = useData();
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    content: ''
  });

  const canEdit = user && hasAccess(user.role, 15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      author: user?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    };

    if (editingId) {
      updateBulletinPost(editingId, postData);
    } else {
      addBulletinPost(postData);
    }

    handleCancel();
  };

  const handleEdit = (post: BulletinPost) => {
    setFormData({
      title: post.title,
      content: post.content
    });
    setEditingId(post.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bulletin post?')) {
      deleteBulletinPost(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
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
          {canEdit && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Add Bulletin Post"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border-l-4 border-blue-400 pl-4 py-2 relative group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>by {post.author}</span>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Post"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No announcements</p>
            {canEdit && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Add first announcement
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulletin Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? 'Edit Bulletin Post' : 'Add Bulletin Post'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <MessageSquare className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bulletin title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bulletin content"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Post'} Bulletin
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
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Bulletin Board</h3>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border-l-4 border-blue-400 pl-4 py-2">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>by {post.author}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No announcements</p>
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;