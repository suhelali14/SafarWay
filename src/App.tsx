import { Link, Outlet } from "react-router-dom";
import { Plane, Building2, Mountain, Map, Briefcase, Car, Camera, CreditCard, Globe, Menu, X } from "lucide-react";
import { useState } from 'react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="text-2xl font-bold text-emerald-600 flex items-center">
              <Mountain className="mr-2" />
              <span>SafarWay</span>
              <span className="text-xs text-gray-500 ml-2">Discover India's Beauty</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">24/7 Support</span>
                <img src="/in-flag.png" alt="India" className="w-6 h-4" />
                <span className="text-sm">India</span>
              </div>
              <button className="bg-emerald-500 text-white px-4 py-1.5 rounded hover:bg-emerald-600 transition-colors text-sm">
                Login or Signup
              </button>
            </div>
            <button className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-between border-t border-gray-100 pt-2">
            <NavLinks />
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              <NavLinks />
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors w-full">
                Login or Signup
              </button>
            </nav>
          </div>
        )}
      </header>
      
      <Outlet />
    </>
  )
}

function NavLinks() {
  const navItems = [
    { icon: <Mountain size={20} />, label: "Adventure Tours", href: "/adventure" },
    { icon: <Building2 size={20} />, label: "Heritage Tours", href: "/heritage" },
    { icon: <Camera size={20} />, label: "Photography Tours", href: "/photography" },
    { icon: <Map size={20} />, label: "Wildlife Safari", href: "/wildlife" },
    { icon: <Briefcase size={20} />, label: "Pilgrimage", href: "/pilgrimage" },
    { icon: <Car size={20} />, label: "Road Trips", href: "/roadtrips" },
    { icon: <Plane size={20} />, label: "International", href: "/international" },
    { icon: <CreditCard size={20} />, label: "Special Offers", href: "/offers" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
