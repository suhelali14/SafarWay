import { useState, useCallback } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Search, MapPin } from 'lucide-react'

interface Location {
  lat: number
  lng: number
  name: string
}

interface LocationPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (location: Location) => void
}

// Custom marker icon SVG
const MARKER_ICON = {
  path: "M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
  fillColor: "#4F46E5",
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: "#FFFFFF",
  scale: 1.5,
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"]

export function LocationPicker({ isOpen, onClose, onSelect }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationName, setLocationName] = useState('')

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries
  })

  const handleSearch = useCallback(() => {
    if (!searchQuery || !isLoaded) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchQuery }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === 'OK' && results?.[0]) {
      const { lat, lng } = results[0].geometry.location
      setSelectedLocation({
        lat: lat(),
        lng: lng(),
        name: results[0].formatted_address
      })
      setLocationName(results[0].formatted_address)
      }
    })
  }, [searchQuery, isLoaded])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        name: locationName || 'Selected Location'
      };
      setSelectedLocation(newLocation);
      onSelect(newLocation);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect({ ...selectedLocation, name: locationName })
      onClose()
    }
  }

  if (loadError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-center text-red-500">
            Error loading Google Maps. Please check your API key.
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-center">Loading map...</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-[400px] relative rounded-lg overflow-hidden border">
            <GoogleMap
              zoom={12}
              center={selectedLocation || { lat: 28.6139, lng: 77.2090 }}
              mapContainerClassName="w-full h-full"
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
              }}
            >
              {selectedLocation && (
                <Marker
                  position={selectedLocation}
                  icon={{
                    ...MARKER_ICON,
                    anchor: new window.google.maps.Point(12, 24),
                  }}
                />
              )}
            </GoogleMap>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input
              placeholder="Location name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation || !locationName}>
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 