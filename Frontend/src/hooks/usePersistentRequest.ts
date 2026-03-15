import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface PersistentRequestOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showToasts?: boolean;
}

export const usePersistentRequest = (options: PersistentRequestOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<Promise<any> | null>(null);

  const { onSuccess, onError, showToasts = true } = options;

  const executeRequest = useCallback(async (
    requestFn: () => Promise<any>,
    successMessage?: string
  ) => {
    // Cancel previous request if exists
    if (requestRef.current) {
      try {
        // Note: This is a simplified approach
        // In production, you'd use proper cancellation tokens
      } catch (e) {
        console.log('Previous request cleanup');
      }
    }

    setLoading(true);
    setError(null);

    try {
      const request = requestFn();
      requestRef.current = request;
      
      const result = await request;
      
      if (showToasts && successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Request failed';
      setError(errorMessage);
      
      if (showToasts) {
        toast.error(errorMessage);
      }
      
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
      requestRef.current = null;
    }
  }, [onSuccess, onError, showToasts]);

  return {
    loading,
    error,
    executeRequest,
    clearError: () => setError(null)
  };
};
