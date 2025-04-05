import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MapPin, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-black-600 flex items-center">
            <MapPin className="mr-2 text-orange-400" />
            <span>SafarWay</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
          <button className="bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition-colors">
            Login / Register
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <NavLinks />
            <button className="bg-sky-600 text-white px-4 py-2 rounded-full hover:bg-sky-700 transition-colors w-full">
              Login / Register
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLinks() {
  return (
    <>
      <Link to="/" className="text-gray-800 hover:text-sky-600 transition-colors">
        Home
      </Link>
      <Link to="/packages" className="text-gray-800 hover:text-sky-600 transition-colors">
        Packages
      </Link>
      <Link to="/destinations" className="text-gray-800 hover:text-sky-600 transition-colors">
        Top Destinations
      </Link>
      <Link to="/why-safarway" className="text-gray-800 hover:text-sky-600 transition-colors">
        Why SafarWay?
      </Link>
      <Link to="/list-package" className="text-gray-800 hover:text-sky-600 transition-colors">
        List Your Package
      </Link>
    </>
  );
}
