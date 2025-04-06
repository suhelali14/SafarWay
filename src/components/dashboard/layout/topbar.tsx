import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface TopbarProps {
  vendorName: string
  vendorImage?: string
}

export function Topbar({ vendorName, vendorImage }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      title: 'New Booking',
      message: 'You have a new booking for Ladakh Adventure',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Review Received',
      message: 'New 5-star review for Kerala Package',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of ₹29,999 has been credited',
      time: '2 hours ago',
      unread: false
    }
  ]

  return (
    <div className="fixed top-0 right-0 z-30 w-full bg-white border-b border-gray-200 lg:pl-72">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side - Welcome message */}
        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome back, {vendorName}
          </h2>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <Link
                    to="/dashboard/notifications"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {vendorImage ? (
                <img
                  src={vendorImage}
                  alt={vendorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User size={16} className="text-emerald-600" />
                </div>
              )}
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {/* Profile Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    // Handle logout
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 