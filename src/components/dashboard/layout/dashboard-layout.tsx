import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Example vendor data - replace with actual data from your auth system
  const vendorData = {
    name: 'Mountain Adventures',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=64&h=64&fit=crop'
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className={`lg:pl-72 ${isMobile ? 'pl-0' : 'pl-64'}`}>
        {/* Topbar */}
        <Topbar
          vendorName={vendorData.name}
          vendorImage={vendorData.image}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 