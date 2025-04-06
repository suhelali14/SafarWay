"use client"

import { useState } from "react"
import { Search, Map, Calendar, Users, Mountain } from "lucide-react"

export function SearchBar() {
  const [tourType, setTourType] = useState("adventure")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [duration, setDuration] = useState("3-5 days")
  const [groupSize, setGroupSize] = useState("2-4 people")

  return (
    <div className="flex flex-col gap-4">
      {/* Tour Type Selection */}
      <div className="flex gap-4 mb-2 overflow-x-auto pb-2">
        {[
          { id: "adventure", label: "Adventure" },
          { id: "heritage", label: "Heritage" },
          { id: "wildlife", label: "Wildlife" },
          { id: "photography", label: "Photography" },
          { id: "pilgrimage", label: "Pilgrimage" }
        ].map((type) => (
          <button
            key={type.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              tourType === type.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setTourType(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="col-span-1 bg-gray-50 rounded p-2">
          <label className="block text-xs text-gray-500 mb-1">DESTINATION</label>
          <div className="flex items-center gap-2">
            <Map className="text-gray-400" size={20} />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="col-span-1 bg-gray-50 rounded p-2">
          <label className="block text-xs text-gray-500 mb-1">START DATE</label>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400" size={20} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="col-span-1 bg-gray-50 rounded p-2">
          <label className="block text-xs text-gray-500 mb-1">DURATION</label>
          <div className="flex items-center gap-2">
            <Mountain className="text-gray-400" size={20} />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
            >
              <option value="1-2 days">1-2 Days</option>
              <option value="3-5 days">3-5 Days</option>
              <option value="6-10 days">6-10 Days</option>
              <option value="10+ days">10+ Days</option>
            </select>
          </div>
        </div>

        {/* Group Size */}
        <div className="col-span-1 bg-gray-50 rounded p-2">
          <label className="block text-xs text-gray-500 mb-1">GROUP SIZE</label>
          <div className="flex items-center gap-2">
            <Users className="text-gray-400" size={20} />
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm"
            >
              <option value="1 person">Solo Traveler</option>
              <option value="2-4 people">2-4 People</option>
              <option value="5-8 people">5-8 People</option>
              <option value="9+ people">9+ People</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button className="mt-4 bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
        FIND PERFECT TOUR
      </button>

      {/* Popular Destinations */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="text-gray-500">Popular:</span>
        {["Ladakh", "Kerala", "Rajasthan", "Himachal"].map((place) => (
          <button
            key={place}
            onClick={() => setDestination(place)}
            className="text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            {place}
          </button>
        ))}
      </div>
    </div>
  )
}

