import api from './api';

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await api.get('/health', { 
            timeout: 5000 // 5 second timeout for health check
        });
        return response.status === 200;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
};

export const checkApiEndpoint = async (endpoint: string): Promise<boolean> => {
    try {
        const response = await api.get(endpoint, { 
            timeout: 10000 // 10 second timeout
        });
        return response.status === 200;
    } catch (error) {
        console.error(`API endpoint ${endpoint} check failed:`, error);
        return false;
    }
};
