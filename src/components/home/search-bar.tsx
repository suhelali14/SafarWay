"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Calendar, Users, ArrowRight, X } from "lucide-react"

export function SearchBar() {
  const [destination, setDestination] = useState("")
  const [dates, setDates] = useState("")
  const [travelers, setTravelers] = useState("")
  const [category, setCategory] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dateButtonRef = useRef<HTMLButtonElement>(null)

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          dateButtonRef.current && !dateButtonRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setDates(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
    setShowCalendar(false)
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const days = []
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    
    // Get number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" aria-hidden="true"></div>)
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
      const isSelected = selectedDate && i === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()
      
      days.push(
        <button
          key={`day-${i}`}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isToday ? 'bg-orange-100 text-orange-600 font-medium' : ''
          } ${
            isSelected ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 text-gray-800'
          }`}
          onClick={() => handleDateSelect(date)}
          aria-label={`Select date ${i}`}
          aria-current={isToday ? 'date' : undefined}
        >
          {i}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      {/* Row 1: Destination */}
      <div className="mb-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 placeholder-gray-400"
            placeholder="Where do you want to go?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2: Date and Travelers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Date Input */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <button
            ref={dateButtonRef}
            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-left transition-all text-gray-800 hover:border-orange-300"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <span className={dates ? "text-gray-800" : "text-gray-400"}>
              {dates || "Select Date"}
            </span>
          </button>
          
          {/* Calendar Popup - Positioned relative to button */}
          {showCalendar && (
            <div 
              ref={calendarRef}
              className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl p-4 w-[320px] border border-gray-200 animate-scale-in calendar-container z-50"
              role="dialog"
              aria-label="Calendar"
              aria-modal="true"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Select Date</h3>
                <button 
                  className="text-orange-500 hover:text-orange-600 text-sm flex items-center"
                  onClick={() => setShowCalendar(false)}
                >
                  <X size={16} className="mr-1" />
                  Close
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays()}
              </div>
            </div>
          )}
        </div>

        {/* Travelers Select */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <select
            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white text-gray-800 hover:border-orange-300"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
          >
            <option value="">Select Travelers</option>
            <option value="1">1 Traveler</option>
            <option value="2">2 Travelers</option>
            <option value="3">3 Travelers</option>
            <option value="4">4 Travelers</option>
            <option value="5+">5+ Travelers</option>
          </select>
        </div>
      </div>

      {/* Row 3: Category and Search */}
      <div className="grid grid-cols-12 gap-4">
        {/* Categories Select */}
        <div className="col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <select
            className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white text-gray-800 hover:border-orange-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="leisure">Leisure</option>
            <option value="adventure">Adventure</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="family">Family</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="col-span-4">
          <button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center group font-medium shadow-lg shadow-orange-100 hover:shadow-orange-200"
            onClick={() => {
              console.log("Searching with:", { destination, dates, travelers, category })
            }}
          >
            Search
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">Popular:</span>
        {['Bali Packages', 'Dubai Tours', 'Maldives Getaways', 'European Tours'].map((item) => (
          <button 
            key={item}
            className="text-sm text-orange-500 hover:text-orange-600 transition-colors hover:underline"
            onClick={() => setDestination(item.split(' ')[0])}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

