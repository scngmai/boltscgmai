import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { BulletinPost } from '../../types';

interface BulletinBoardProps {
  posts: BulletinPost[];
}

const BulletinBoard: React.FC<BulletinBoardProps> = ({ posts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
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