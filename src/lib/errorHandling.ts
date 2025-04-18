import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Handles API errors and extracts relevant information
 */
export function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle response errors
    if (axiosError.response) {
      const { data, status } = axiosError.response;
      
      // If the API returned a structured error response
      if (data && typeof data === 'object') {
        const apiError = data as ApiError;
        
        // Handle validation errors
        if (apiError.errors && Object.keys(apiError.errors).length > 0) {
          const validationErrors = Object.values(apiError.errors)
            .flat()
            .join(', ');
          return new Error(validationErrors);
        }
        
        // Use API provided message if available
        if (apiError.message) {
          return new Error(apiError.message);
        }
      }
      
      // Default error message based on status code
      return new Error(
        status === 401 ? 'Authentication required' :
        status === 403 ? 'You do not have permission to perform this action' :
        status === 404 ? 'Resource not found' :
        status >= 500 ? 'Server error, please try again later' :
        'An unexpected error occurred'
      );
    }
    
    // Network errors
    if (axiosError.request && !axiosError.response) {
      return new Error('Network error, please check your connection');
    }
  }
  
  // Handle non-axios errors or fallback
  return error instanceof Error 
    ? error 
    : new Error('An unexpected error occurred');
} 