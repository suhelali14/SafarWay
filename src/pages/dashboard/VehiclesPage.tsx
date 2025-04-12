import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Plus, Filter } from "lucide-react";

export default function VehiclesPage() {
  const vehicles = [
    {
      id: 1,
      name: "Mercedes Sprinter",
      type: "Van",
      capacity: "15 seats",
      status: "Available",
      lastService: "2024-02-15",
    },
    {
      id: 2,
      name: "Toyota Hiace",
      type: "Van",
      capacity: "12 seats",
      status: "In Use",
      lastService: "2024-01-20",
    },
    {
      id: 3,
      name: "Volvo 9900",
      type: "Bus",
      capacity: "49 seats",
      status: "Maintenance",
      lastService: "2024-02-28",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "In Use":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search vehicles..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-6">
            <div className="space-y-4">
              {/* Vehicle Image Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-lg" />

              {/* Vehicle Info */}
              <div>
                <h3 className="font-medium">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.type}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Capacity</p>
                  <p className="font-medium">{vehicle.capacity}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Service</p>
                  <p className="font-medium">{vehicle.lastService}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 