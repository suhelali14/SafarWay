// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// App Configuration
export const APP_NAME = 'SafarWay';
export const APP_DESCRIPTION = 'Your trusted travel companion';

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  SOCIAL_LOGIN: true,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Currency
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REGISTER_AGENCY: '/auth/register/agency',
  REGISTER_CUSTOMER: '/auth/register/customer',
  ONBOARDING: '/auth/onboarding',
  DASHBOARD: '/dashboard',
  TOURS: '/tours',
  TOUR_DETAILS: '/tours/:id',
  BOOK_TOUR: '/tours/:id/book',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}; 