import Cookies from 'js-cookie';

const TOKEN_KEY = 'safarway_token';
const USER_KEY = 'safarway_user';

interface UserData {
  uid: string;
  email: string;
  role?: string;
  invitedBy?: string;
  createdAt?: Date;
}

export const setAuthCookies = (token: string, user: UserData) => {
  // Set token with 7 days expiry
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  // Set user data with 7 days expiry
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const getUserData = (): UserData | null => {
  const userData = Cookies.get(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUserData();
}; 