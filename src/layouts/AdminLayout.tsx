import { ReactNode } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Toaster } from 'react-hot-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <DashboardLayout>
      {children}
      <Toaster position="top-right" />
    </DashboardLayout>
  );
}; 