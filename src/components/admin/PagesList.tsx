import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Page {
  _id: string;
  title: string;
}

interface PagesListProps {
  pages: Page[];
  onEdit: (page: Page) => void;
  onDelete: (id: string) => void;
}

const PagesList: React.FC<PagesListProps> = ({ pages, onEdit, onDelete }) => {
  return (
    <div className="space-y-2">
      {pages.map((page) => (
        <div
          key={page._id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
        >
          <span className="text-sm font-medium text-gray-700">
            {page.title}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(page)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(page._id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {pages.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No pages created yet
        </p>
      )}
    </div>
  );
};

export default PagesList;