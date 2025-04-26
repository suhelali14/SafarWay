import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Calendar,
  MessageSquare,
  Star,
  IndianRupee,
  Settings,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  isMobile: boolean
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isMobile, isOpen, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [isPackagesOpen, setIsPackagesOpen] = useState(false)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
      id: 'dashboard'
    },
    {
      title: 'My Packages',
      icon: <Package size={20} />,
      id: 'packages',
      submenu: [
        { title: 'All Packages', path: '/dashboard/packages' },
        { title: 'Add Package', path: '/dashboard/packages/add' }
      ]
    },
    {
      title: 'Bookings',
      icon: <Calendar size={20} />,
      path: '/dashboard/bookings',
      id: 'bookings'
    },
    {
      title: 'Messages',
      icon: <MessageSquare size={20} />,
      path: '/dashboard/messages',
      id: 'messages',
      badge: '3'
    },
    {
      title: 'Reviews',
      icon: <Star size={20} />,
      path: '/dashboard/reviews',
      id: 'reviews'
    },
    {
      title: 'Earnings',
      icon: <IndianRupee size={20} />,
      path: '/dashboard/earnings',
      id: 'earnings'
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/dashboard/settings',
      id: 'settings'
    }
  ]

  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-transform
    ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
    ${isMobile ? 'w-64' : 'w-64 lg:w-72'}
  `

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 lg:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="mb-8 px-2">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">SafarWay</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  // Menu item with submenu
                  <div>
                    <button
                      onClick={() => setIsPackagesOpen(!isPackagesOpen)}
                      className={`
                        flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm
                        ${activeItem === item.id
                          ? 'bg-emerald-50 text-emerald-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          isPackagesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {/* Submenu */}
                    {isPackagesOpen && (
                      <div className="mt-1 ml-9 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu item
                  <Link
                    to={item.path}
                    onClick={() => setActiveItem(item.id)}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm
                      ${activeItem === item.id
                        ? 'bg-emerald-50 text-emerald-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
} 