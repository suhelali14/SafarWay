import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Globe, Star, Plane, Building2, Train, Car, Bus, Mountain, DollarSign, Shield } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isReligiousMode, setIsReligiousMode] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navItems = [
    { icon: <Mountain className="w-5 h-5" />, label: 'Tours', href: '/tours' },
    { icon: <Plane className="w-5 h-5" />, label: 'Flights', href: '/flights' },
    { icon: <Building2 className="w-5 h-5" />, label: 'Hotels', href: '/hotels' },
    { icon: <Train className="w-5 h-5" />, label: 'Trains', href: '/trains' },
    { icon: <Car className="w-5 h-5" />, label: 'Cabs', href: '/cabs' },
    { icon: <Bus className="w-5 h-5" />, label: 'Bus', href: '/bus' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Forex', href: '/forex' },
    { icon: <Shield className="w-5 h-5" />, label: 'Insurance', href: '/insurance' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Mountain className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-600">SafarWay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-emerald-600 transition-colors">
              Login
            </button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t">
                <button className="w-full text-gray-700 hover:text-emerald-600 transition-colors mb-2">
                  Login
                </button>
                <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors">
                  Register
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 