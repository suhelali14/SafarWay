"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Globe, Star } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isReligiousMode, setIsReligiousMode] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-sky-600">Safar<span className="text-orange-500">Way</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/packages" className="text-gray-700 hover:text-orange-500 transition-colors">
              All Packages
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-orange-500 transition-colors">
              Destinations
            </Link>
            <Link href="/agencies" className="text-gray-700 hover:text-orange-500 transition-colors">
              Travel Agencies
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
              About Us
            </Link>
          </nav>

          {/* Religious Mode Toggle */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center mr-4">
              <span className="text-sm text-gray-600 mr-2">
                {isReligiousMode ? <Star className="w-4 h-4 text-orange-500" /> : <Globe className="w-4 h-4 text-sky-500" />}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isReligiousMode}
                  onChange={() => setIsReligiousMode(!isReligiousMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <Link 
              href="/login" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/packages" 
              className="block text-gray-700 hover:text-orange-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Packages
            </Link>
            <Link 
              href="/destinations" 
              className="block text-gray-700 hover:text-orange-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link 
              href="/agencies" 
              className="block text-gray-700 hover:text-orange-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Travel Agencies
            </Link>
            <Link 
              href="/about" 
              className="block text-gray-700 hover:text-orange-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            
            {/* Mobile Religious Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Religious Tourism Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isReligiousMode}
                  onChange={() => setIsReligiousMode(!isReligiousMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            
            <Link 
              href="/login" 
              className="block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
} 