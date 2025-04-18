import Cookies from 'js-cookie';

const TOKEN_KEY = 'safarway_token';
const USER_DATA_KEY = 'safarway_user';
const COOKIE_EXPIRY = 7; // days

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'SAFARWAY_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  profileImage?: string | null;
  phone?: string;
  provider?: string;
  deviceTokens?: string[];
  agencyId?: string | null;
  inviteToken?: string | null;
  invitedByUserId?: string | null;
  invitedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  agency?: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    description?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
    logo?: string | null;
    media?: any[];
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  customer?: {
    id: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
  } | null;
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
  try {
    const userData = Cookies.get(USER_DATA_KEY);
    if (!userData || userData === 'undefined') {
      console.log('No user data found in cookie');
      return null;
    }
    const parsed = JSON.parse(userData);
    if (!parsed || typeof parsed !== 'object') {
      console.log('Invalid user data format in cookie');
      removeUserData();
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing user data:', error);
    removeUserData();
    return null;
  }
};

export const setUserData = (userData: UserData): void => {
  try {
    if (!userData || typeof userData !== 'object') {
      console.error('Invalid user data:', userData);
      throw new Error('Invalid user data');
    }
    
    // Validate required fields
    if (!userData.id || !userData.email || !userData.role) {
      console.error('Missing required user data fields:', userData);
      throw new Error('Invalid user data: missing required fields');
    }

    const userDataString = JSON.stringify(userData);
    if (!userDataString || userDataString === 'undefined') {
      throw new Error('Failed to stringify user data');
    }

    console.log('Setting user data:', userDataString);

    Cookies.set(USER_DATA_KEY, userDataString, {
      expires: COOKIE_EXPIRY,
      secure: true,
      sameSite: 'strict'
    });

    // Verify the data was set correctly
    const verifyData = Cookies.get(USER_DATA_KEY);
    if (!verifyData || verifyData === 'undefined') {
      throw new Error('Failed to verify user data after setting');
    }
  } catch (error) {
    console.error('Error setting user data:', error);
    removeUserData();
    throw error;
  }
};

export const removeUserData = (): void => {
  Cookies.remove(USER_DATA_KEY);
};

export const clearSession = (): void => {
  removeToken();
  removeUserData();
};

// Initialize session with token and user data
export const initializeSession = (token: string, userData: UserData): void => {
  try {
    if (!token || !userData) {
      console.error('Missing token or user data:', { token: !!token, userData: !!userData });
      throw new Error('Missing token or user data');
    }

    console.log('Initializing session with:', { 
      token: token.substring(0, 10) + '...', 
      userData 
    });

    setToken(token);
    setUserData(userData);
  } catch (error) {
    console.error('Error initializing session:', error);
    clearSession();
    throw new Error('Failed to initialize session');
  }
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