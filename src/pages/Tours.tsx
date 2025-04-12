import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, Users, Star, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Slider } from "../components/ui/slider"
import { Link } from "react-router-dom"
import { TourPackage, toursApi } from "../lib/api/tours"
import { useToast } from "../components/ui/use-toast"
import { TourCard } from "../components/tours/TourCard"

interface Filters {
  search: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  duration: number;
  sortBy: string;
}

export default function ToursPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    minPrice: 0,
    maxPrice: 100000,
    duration: 0,
    sortBy: "featured",
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await toursApi.getAll({
          type: filters.type !== "all" ? filters.type as TourPackage["tourType"] : undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          duration: filters.duration || undefined,
          search: filters.search || undefined,
        });
        setTours(response.data);
        setFilteredTours(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to load tours. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters, toast]);

  useEffect(() => {
    let result = [...tours];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        tour =>
          tour.title.toLowerCase().includes(searchLower) ||
          tour.subtitle.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.type !== "all") {
      result = result.filter(tour => tour.tourType.toLowerCase() === filters.type);
    }

    // Apply price filter
    result = result.filter(
      tour =>
        tour.pricePerPerson >= filters.minPrice &&
        tour.pricePerPerson <= filters.maxPrice
    );

    // Apply duration filter
    if (filters.duration > 0) {
      result = result.filter(tour => tour.duration <= filters.duration);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case "price-desc":
        result.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
        break;
      case "duration":
        result.sort((a, b) => b.duration - a.duration);
        break;
      default:
        // Default sorting by title
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTours(result);
  }, [tours, filters]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Tours</h1>
        <p className="text-muted-foreground mt-2">
          Discover amazing tours and adventures
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Filters */}
        <Card className="p-4 md:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-semibold">Filters</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search tours..."
                value={filters.search}
                onChange={e => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tour Type</label>
              <Select
                value={filters.type}
                onValueChange={value => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Slider
                min={0}
                max={100000}
                step={1000}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) => {
                  handleFilterChange("minPrice", min);
                  handleFilterChange("maxPrice", max);
                }}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{filters.minPrice.toLocaleString()}</span>
                <span>₹{filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Duration (days)</label>
              <Slider
                min={0}
                max={30}
                step={1}
                value={[filters.duration]}
                onValueChange={([value]) => handleFilterChange("duration", value)}
              />
              <div className="text-sm text-muted-foreground">
                {filters.duration === 0 ? "Any" : `${filters.duration} days`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tour Grid */}
        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTours.length} tours
            </p>
            <Select
              value={filters.sortBy}
              onValueChange={value => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">No tours found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 