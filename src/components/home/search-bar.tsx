"use client"

import { Map, Calendar, Users, Mountain } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function SearchBar() {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Where do you want to go?"
            className="pl-10 h-12"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="When?"
            className="pl-10 h-12"
          />
        </div>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Number of people"
            className="pl-10 h-12"
          />
        </div>
        <Button className="h-12 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700">
          <Mountain className="h-5 w-5 mr-2" />
          Search Tours
        </Button>
      </div>
    </div>
  )
}

