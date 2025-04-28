import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Plane, Building2, Train, Car, Bus, Mountain, IndianRupee, Shield } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/tours", label: "Tours", icon: <Mountain size={20} /> },
    { href: "/flights", label: "Flights", icon: <Plane size={20} /> },
    { href: "/hotels", label: "Hotels", icon: <Building2 size={20} /> },
    { href: "/trains", label: "Trains", icon: <Train size={20} /> },
    { href: "/cabs", label: "Cabs", icon: <Car size={20} /> },
    { href: "/bus", label: "Bus", icon: <Bus size={20} /> },
    { href: "/forex", label: "Forex", icon: <IndianRupee size={20} /> },
    { href: "/insurance", label: "Insurance", icon: <Shield size={20} /> }
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-sky-600">SafarWay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-sky-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-2 text-gray-700 hover:text-sky-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 