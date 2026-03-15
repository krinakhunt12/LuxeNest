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
      
      // Don't retry on authentication errors or client errors (4xx)
      if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
        console.log('Not retrying client error:', error.response.status);
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        console.log('Max retries reached for:', error.message);
        throw error;
      }
      
      // Wait before retrying
      console.log(`Retrying request (attempt ${attempt}/${maxRetries}) after ${delay * attempt}ms`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
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
