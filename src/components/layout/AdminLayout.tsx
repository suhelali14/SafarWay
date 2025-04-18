import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <footer className="py-4 px-6 border-t text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SafarWay. All rights reserved.
        </footer>
      </div>
    </div>
  );
} 