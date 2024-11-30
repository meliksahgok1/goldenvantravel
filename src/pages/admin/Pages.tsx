import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ErrorAlert from '../../components/admin/ErrorAlert';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import SuccessAlert from '../../components/admin/SuccessAlert';
import PageEditor from '../../components/admin/PageEditor';
import PagesList from '../../components/admin/PagesList';

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Partial<Page> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      const data = await response.json();
      setPages(data || []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to load pages'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async () => {
    if (!selectedPage?.title || !selectedPage?.slug) {
      setMessage({ type: 'error', text: 'Title and slug are required' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/.netlify/functions/pages', {
        method: selectedPage._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPage),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save page');
      }

      setMessage({ type: 'success', text: 'Page saved successfully' });
      setIsEditing(false);
      setSelectedPage(null);
      fetchPages();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while saving'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/.netlify/functions/pages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      setMessage({ type: 'success', text: 'Page deleted successfully' });
      fetchPages();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while deleting'
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Sayfa Yönetimi</h1>
        <button
          onClick={() => {
            setSelectedPage({
              title: '',
              slug: '',
              content: '',
              isPublished: false,
            });
            setIsEditing(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Sayfa
        </button>
      </div>

      {message && (
        message.type === 'success' 
          ? <SuccessAlert message={message.text} />
          : <ErrorAlert message={message.text} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sayfalar</h2>
          <PagesList
            pages={pages}
            onEdit={(page) => {
              setSelectedPage(page);
              setIsEditing(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {isEditing && selectedPage && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <PageEditor
              page={selectedPage}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setSelectedPage(null);
                setMessage(null);
              }}
              onChange={(updates) => setSelectedPage({ ...selectedPage, ...updates })}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;