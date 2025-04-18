"use client"

import { MapPin, Calendar, Users, Search, Repeat, ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import { motion } from "framer-motion"

export function SearchBar() {
  const [date, setDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [tripType, setTripType] = useState("roundTrip")

  return (
    <div className="space-y-5">
      {/* Trip Type Selection */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "roundTrip"} 
            onChange={() => setTripType("roundTrip")}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-medium">Round Trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "oneWay"} 
            onChange={() => setTripType("oneWay")}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-medium">One Way</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="tripType" 
            checked={tripType === "multiCity"} 
            onChange={() => setTripType("multiCity")}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700 font-medium">Multi-City</span>
        </label>
      </div>

      {/* Main Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* From */}
        <div className="relative">
          <label className="text-xs font-medium text-gray-500 mb-1 block">FROM</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
            <Select>
              <SelectTrigger className="w-full pl-10 py-6 border-gray-300 hover:border-blue-500 transition-colors rounded-lg">
                <div className="text-left">
                  <div className="font-medium">Delhi</div>
                  <div className="text-xs text-gray-500">DEL, Indira Gandhi Airport</div>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi (DEL)</SelectItem>
                <SelectItem value="mumbai">Mumbai (BOM)</SelectItem>
                <SelectItem value="bangalore">Bangalore (BLR)</SelectItem>
                <SelectItem value="chennai">Chennai (MAA)</SelectItem>
                <SelectItem value="kolkata">Kolkata (CCU)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button (Between From and To) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:block z-10">
          <button className="bg-white p-2 rounded-full shadow-lg border border-gray-200 text-blue-600 hover:scale-110 transition-transform">
            <Repeat className="h-5 w-5" />
          </button>
        </div>

        {/* To */}
        <div className="relative">
          <label className="text-xs font-medium text-gray-500 mb-1 block">TO</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
            <Select>
              <SelectTrigger className="w-full pl-10 py-6 border-gray-300 hover:border-blue-500 transition-colors rounded-lg">
                <div className="text-left">
                  <div className="font-medium">Mumbai</div>
                  <div className="text-xs text-gray-500">BOM, Chhatrapati Shivaji Airport</div>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi (DEL)</SelectItem>
                <SelectItem value="mumbai">Mumbai (BOM)</SelectItem>
                <SelectItem value="bangalore">Bangalore (BLR)</SelectItem>
                <SelectItem value="chennai">Chennai (MAA)</SelectItem>
                <SelectItem value="kolkata">Kolkata (CCU)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Departure Date */}
        <div className="relative">
          <label className="text-xs font-medium text-gray-500 mb-1 block">DEPARTURE</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full pl-10 py-6 border-gray-300 hover:border-blue-500 transition-colors justify-start font-normal rounded-lg"
              >
                <Calendar className="absolute left-3 h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">
                    {date ? format(date, "dd MMM, yyyy") : "Select Date"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date ? format(date, "EEEE") : "Flexible dates available"}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date - Only show for round trip */}
        {tripType === "roundTrip" && (
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">RETURN</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full pl-10 py-6 border-gray-300 hover:border-blue-500 transition-colors justify-start font-normal rounded-lg"
                >
                  <Calendar className="absolute left-3 h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">
                      {returnDate ? format(returnDate, "dd MMM, yyyy") : "Select Date"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {returnDate ? format(returnDate, "EEEE") : "Flexible dates available"}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Travelers & Class - Show conditionally based on type */}
        {(tripType === "oneWay" || tripType === "multiCity" || tripType === "roundTrip" && !returnDate) && (
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 mb-1 block">TRAVELERS & CLASS</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
              <Select>
                <SelectTrigger className="w-full pl-10 py-6 border-gray-300 hover:border-blue-500 transition-colors rounded-lg">
                  <div className="text-left">
                    <div className="font-medium">2 Travelers</div>
                    <div className="text-xs text-gray-500">Economy Class</div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1e">1 Traveler, Economy</SelectItem>
                  <SelectItem value="2e">2 Travelers, Economy</SelectItem>
                  <SelectItem value="1b">1 Traveler, Business</SelectItem>
                  <SelectItem value="2b">2 Travelers, Business</SelectItem>
                  <SelectItem value="1f">1 Traveler, First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-6">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-lg font-semibold py-3 px-12 rounded-lg shadow-lg flex items-center gap-2"
        >
          Search Flights
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Fare Types */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <input type="radio" name="fareType" id="regular" defaultChecked className="text-blue-600"/>
          <label htmlFor="regular" className="text-gray-700">Regular Fares</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="radio" name="fareType" id="armed" className="text-blue-600"/>
          <label htmlFor="armed" className="text-gray-700">Armed Forces Fares</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="radio" name="fareType" id="student" className="text-blue-600"/>
          <label htmlFor="student" className="text-gray-700">Student Fares</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="radio" name="fareType" id="senior" className="text-blue-600"/>
          <label htmlFor="senior" className="text-gray-700">Senior Citizen Fares</label>
        </div>
      </div>
    </div>
  )
}
