import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface UseDataOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showToast?: boolean;
}

export function useData<T>(
  fetchFn: (...args: any[]) => Promise<any>,
  options: UseDataOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const fetchData = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn(...args);
      setData(response.data);
      options.onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);
      options.onError?.(err);
      
      if (options.showToast) {
        toast.error(err.response?.data?.message || 'An error occurred');
      }

      if (err.response?.status === 401) {
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const mutate = async (data: any, ...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn(data, ...args);
      setData(response.data);
      options.onSuccess?.(response.data);
      if (options.showToast) {
        toast.success('Operation completed successfully');
      }
      return response.data;
    } catch (err: any) {
      setError(err);
      options.onError?.(err);
      if (options.showToast) {
        toast.error(err.response?.data?.message || 'An error occurred');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchData,
    mutate,
  };
}

// Example usage:
// const { data, loading, error, fetchData } = useData(getTours, { showToast: true });
// useEffect(() => { fetchData(); }, []); 