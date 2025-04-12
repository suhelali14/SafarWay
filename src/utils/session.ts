import Cookies from 'js-cookie';

const TOKEN_KEY = 'safarway_token';
const USER_DATA_KEY = 'safarway_user';
const COOKIE_EXPIRY = 7; // days

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'SAFARWAY_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  agency?: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  };
  customer?: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
}

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    secure: true,
    sameSite: 'strict',
  });
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const getUserData = (): UserData | null => {
  const userData = Cookies.get(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (userData: UserData): void => {
  Cookies.set(USER_DATA_KEY, JSON.stringify(userData), {
    expires: 7, // 7 days
    secure: true,
    sameSite: 'strict',
  });
};

export const removeUserData = (): void => {
  Cookies.remove(USER_DATA_KEY);
};

export const clearSession = (): void => {
  removeToken();
  removeUserData();
};

// Check if session is valid
export const isValid = (): boolean => {
  try {
    const token = getToken();
    const user = getUserData();
    
    console.log('Checking session validity:', { 
      hasToken: !!token, 
      hasUser: !!user,
      userStatus: user?.status
    });
    
    if (!token || !user) {
      console.log('Missing token or user data');
      return false;
    }
    
    // Check if user is active
    if (user.status !== 'ACTIVE') {
      console.log('User is not active');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
}; 