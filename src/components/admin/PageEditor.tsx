import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Save } from 'lucide-react';

interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

interface PageEditorProps {
  page: Partial<Page>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onChange: (updates: Partial<Page>) => void;
  isSubmitting: boolean;
}

const PageEditor: React.FC<PageEditorProps> = ({
  page,
  onSave,
  onCancel,
  onChange,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sayfa Başlığı
        </label>
        <input
          type="text"
          value={page.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          URL Slug
        </label>
        <input
          type="text"
          value={page.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İçerik
        </label>
        <Editor
          value={page.content}
          init={{
            height: 500,
            menubar: true,
            readonly: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
              'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
              'fullscreen', 'insertdatetime', 'media', 'table', 'code',
              'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }'
          }}
          onEditorChange={(content) => onChange({ content })}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={page.isPublished}
          onChange={(e) => onChange({ isPublished: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Yayınla
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          onClick={onSave}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
};

export default PageEditor;