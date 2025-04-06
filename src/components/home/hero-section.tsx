"use client"
import { SearchBar } from "./search-bar"

export function HeroSection() {
  return (
    <div className="relative h-[600px] bg-gradient-to-r from-sky-600 to-emerald-600">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1544731612-de7f96afe55f"
          alt="Hero background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl">
          Discover Amazing Places with SafarWay
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl">
          Find and book the best tours, activities, and experiences across India
        </p>
        <SearchBar />
      </div>
    </div>
  )
}

