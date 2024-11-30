import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Page {
  title: string;
  content: string;
  isPublished: boolean;
}

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/.netlify/functions/pages?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Page not found');
        }
        const data = await response.json();
        setPage(data);
      } catch (err) {
        setError('Sayfa bulunamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">{error || 'Sayfa bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose lg:prose-xl mx-auto">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </div>
  );
};

export default DynamicPage;