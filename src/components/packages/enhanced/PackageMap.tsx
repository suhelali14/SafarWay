import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Maximize, Minimize } from 'lucide-react';
import { Button } from '../../ui/button';

interface PackageMapProps {
  destination: string;
  coordinates?: { lat: number; lng: number };
  height?: string;
  className?: string;
  showFullscreen?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function PackageMap({
  destination,
  coordinates,
  height = '400px',
  className = '',
  showFullscreen = true,
}: PackageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    // If coordinates are not provided, we need to geocode the destination
    if (!coordinates && destination) {
      // First check if Google Maps API is loaded
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          setError('Failed to load Google Maps. Please try again later.');
          setIsLoading(false);
        };

        window.initMap = () => {
          setIsLoaded(true);
          initializeMap();
        };

        document.head.appendChild(script);

        return () => {
          window.initMap = () => {};
          document.head.removeChild(script);
        };
      }
    } else if (coordinates) {
      // If coordinates are provided, we can initialize the map directly
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          setError('Failed to load Google Maps. Please try again later.');
          setIsLoading(false);
        };

        window.initMap = () => {
          setIsLoaded(true);
          initializeMap();
        };

        document.head.appendChild(script);

        return () => {
          window.initMap = () => {};
          document.head.removeChild(script);
        };
      }
    }
  }, [destination, coordinates, isLoaded]);

  // Initialize map function
  const initializeMap = () => {
    if (!mapRef.current) return;
    setIsLoading(true);

    try {
      // If coordinates are provided, use them
      if (coordinates) {
        const mapOptions = {
          center: { lat: coordinates.lat, lng: coordinates.lng },
          zoom: 10,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: false,
          streetViewControl: true,
          zoomControl: true,
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // Add marker
        new window.google.maps.Marker({
          position: { lat: coordinates.lat, lng: coordinates.lng },
          map: newMap,
          title: destination,
          animation: window.google.maps.Animation.DROP,
        });

        setMap(newMap);
        setIsLoading(false);
      } 
      // Otherwise, geocode the destination
      else if (destination) {
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address: destination }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const mapOptions = {
              center: results[0].geometry.location,
              zoom: 10,
              mapTypeId: window.google.maps.MapTypeId.ROADMAP,
              mapTypeControl: true,
              fullscreenControl: false,
              streetViewControl: true,
              zoomControl: true,
            };

            const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
            
            // Add marker
            new window.google.maps.Marker({
              position: results[0].geometry.location,
              map: newMap,
              title: destination,
              animation: window.google.maps.Animation.DROP,
            });

            setMap(newMap);
          } else {
            console.error('Geocode was not successful for the following reason:', status);
            setError('Could not find the location on the map.');
          }
          
          setIsLoading(false);
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('An error occurred while initializing the map.');
      setIsLoading(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Re-center map after transition
    setTimeout(() => {
      if (map) {
        window.google.maps.event.trigger(map, 'resize');
        
        // Re-center the map if we have coordinates
        if (coordinates) {
          map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
        }
      }
    }, 300);
  };

  // Handle resize to recenter map
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        window.google.maps.event.trigger(map, 'resize');
        
        // Re-center the map if we have coordinates
        if (coordinates) {
          map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map, coordinates]);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-lg border ${
          isFullscreen 
            ? 'fixed inset-0 z-50 m-0 h-screen w-screen rounded-none' 
            : ''
        }`}
      >
        {/* Map loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
            <MapPin className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700">Map Unavailable</h3>
            <p className="text-center text-gray-600">{error}</p>
          </div>
        )}
        
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="h-full w-full"
          style={{ height: isFullscreen ? '100%' : height }}
        ></div>
        
        {/* Fullscreen controls */}
        {showFullscreen && (
          <div className="absolute right-4 top-4 z-10">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/80 backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
        
        {/* Location title bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-3 backdrop-blur-sm">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            <h3 className="font-medium">{destination}</h3>
          </div>
        </div>
      </div>
      
      {/* Get directions link */}
      <div className="mt-2 flex justify-end">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary hover:underline"
        >
          <Navigation className="mr-1 h-4 w-4" />
          Get directions
        </a>
      </div>
    </div>
  );
} 