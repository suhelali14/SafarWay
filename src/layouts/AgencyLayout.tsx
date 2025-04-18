import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Toaster } from "../components/ui/toaster";

export default function AgencyLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex">
      <div
        className={`${
          sidebarCollapsed ? "w-[70px]" : "w-[250px]"
        } transition-all duration-300 ease-in-out`}
      >
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>
      
      <div className="flex-1 overflow-auto">
        <main className="min-h-screen bg-background">
          <Outlet />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
} 