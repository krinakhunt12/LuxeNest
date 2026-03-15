import api from './api';

export const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      console.log(`Retrying request (attempt ${attempt + 1}/${maxRetries})`);
    }
  }
  
  throw lastError;
};

export const apiWithRetry = {
  get: (url: string, config?: any) => 
    retryRequest(() => api.get(url, config)),
  post: (url: string, data?: any, config?: any) => 
    retryRequest(() => api.post(url, data, config)),
  put: (url: string, data?: any, config?: any) => 
    retryRequest(() => api.put(url, data, config)),
  delete: (url: string, config?: any) => 
    retryRequest(() => api.delete(url, config)),
};
