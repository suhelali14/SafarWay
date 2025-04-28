import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin,  Bed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../ui/badge';

interface ItineraryItem {
  title: string;
  description: string;
  activities?: string[];
  meals?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  accommodation?: string;
  location?: string;
}

interface PackageItineraryProps {
  itinerary: ItineraryItem[];
}

export function PackageItinerary({ itinerary }: PackageItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    0: true, // First day expanded by default
  });

  // Toggle day expansion
  const toggleDay = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Expand all days
  const expandAll = () => {
    const newExpandedDays: Record<number, boolean> = {};
    itinerary.forEach((_, index) => {
      newExpandedDays[index] = true;
    });
    setExpandedDays(newExpandedDays);
  };

  // Collapse all days except the first
  const collapseAll = () => {
    const newExpandedDays: Record<number, boolean> = {
      0: true, // Keep first day expanded
    };
    setExpandedDays(newExpandedDays);
  };

  // Check if all days are expanded
  const areAllExpanded = itinerary.every((_, index) => expandedDays[index]);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-gray-600">No itinerary information available for this package.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-xl font-bold">Day-by-Day Itinerary</h2>
        <button
          onClick={areAllExpanded ? collapseAll : expandAll}
          className="text-sm font-medium text-primary hover:underline"
        >
          {areAllExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="divide-y">
        {itinerary.map((day, index) => (
          <div key={index} className="relative">
            {/* Vertical timeline line */}
            {index < itinerary.length - 1 && (
              <div className="absolute bottom-0 left-10 top-14 w-0.5 bg-gray-200"></div>
            )}

            <div className="p-6">
              <button
                onClick={() => toggleDay(index)}
                className="flex w-full items-center text-left"
              >
                {/* Day circle */}
                <div className="relative mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <Calendar className="h-5 w-5" />
                  <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>

                {/* Day title */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{day.title}</h3>
                  {day.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      {day.location}
                    </div>
                  )}
                </div>

                {/* Meals indicators */}
                <div className="mr-4 flex gap-2">
                  {day.meals?.breakfast && (
                    <Badge variant="outline" className="bg-green-50" label="B">
                      
                    </Badge>
                  )}
                  {day.meals?.lunch && (
                    <Badge variant="outline" className="bg-amber-50" label="L">
                      
                    </Badge>
                  )}
                  {day.meals?.dinner && (
                    <Badge variant="outline" className="bg-red-50" label="D">
                      
                    </Badge>
                  )}
                </div>

                {/* Expand/collapse icon */}
                <div className="ml-2">
                  {expandedDays[index] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Day details */}
              <AnimatePresence>
                {expandedDays[index] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pl-16">
                      {/* Description */}
                      <p className="mb-4 text-gray-600">{day.description}</p>

                      {/* Activities */}
                      {day.activities && day.activities.length > 0 && (
                        <div className="mb-4">
                          <h4 className="mb-2 font-medium">Activities:</h4>
                          <ul className="ml-5 list-disc space-y-1 text-gray-600">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Accommodation */}
                      {day.accommodation && (
                        <div className="flex items-center text-gray-600">
                          <Bed className="mr-2 h-4 w-4 text-primary" />
                          <span>
                            <span className="font-medium">Accommodation:</span> {day.accommodation}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 