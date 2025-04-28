export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SAFARWAY_ADMIN' | 'SAFARWAY_USER' | 'AGENCY_ADMIN' | 'AGENCY_USER' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED';
  createdAt: string;
  updatedAt: string;
  agencyId?: string;
  phone: string;
} 