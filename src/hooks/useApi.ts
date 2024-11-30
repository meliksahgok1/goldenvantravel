import { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

interface ApiError extends Error {
  status?: number;
}

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchApi(endpoint);
      setData(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const refetch = () => {
    fetchData();
  };

  return { data, error, isLoading, refetch };
}