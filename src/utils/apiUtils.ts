import axios from 'axios';

/**
 * Check if an API endpoint is available
 * @param url The API URL to check
 * @returns Promise that resolves to true if API is available, false otherwise
 */
export const isApiAvailable = async (url: string): Promise<boolean> => {
  try {
    // Send a HEAD request which is lightweight
    await axios.head(url, { timeout: 3000 });
    return true;
  } catch (error) {
    console.warn(`API at ${url} is not available:`, error);
    return false;
  }
};

/**
 * Safely execute an API call with fallback to mock data
 * @param apiCall The API function to call
 * @param mockData The mock data to return if API fails
 * @returns The API response data or mock data
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>, 
  mockData: T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return mockData;
  }
};

/**
 * Format API error for user-friendly messages
 * @param error The error from API request
 * @returns A user-friendly error message
 */
export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with an error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      if (status === 404) {
        return 'The requested resource was not found.';
      } else if (status === 401 || status === 403) {
        return 'You are not authorized to access this resource.';
      } else if (status >= 500) {
        return 'The server encountered an error. Please try again later.';
      }
      return message;
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from server. Please check your network connection.';
    }
  }
  
  // Default error message
  return error instanceof Error ? error.message : 'An unknown error occurred.';
}; 