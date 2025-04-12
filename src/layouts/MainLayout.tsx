import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ width: isSidebarCollapsed ? 80 : 256 }}
          animate={{ width: isSidebarCollapsed ? 80 : 256 }}
          exit={{ width: isSidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 h-full z-30"
        >
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        </motion.div>
      </AnimatePresence>

      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 