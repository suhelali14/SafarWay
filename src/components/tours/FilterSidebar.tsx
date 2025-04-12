import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { TourPackageFilters } from '../../lib/api/tours';

interface FilterSidebarProps {
  filters: TourPackageFilters;
  onFiltersChange: (filters: TourPackageFilters) => void;
  onClose?: () => void;
  className?: string;
}

const tourTypes = [
  'ADVENTURE',
  'CULTURAL',
  'WILDLIFE',
  'BEACH',
  'MOUNTAIN',
  'CITY',
  'CRUISE',
] as const;

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  onClose,
  className,
}: FilterSidebarProps) => {
  const [localFilters, setLocalFilters] = useState<TourPackageFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (
    key: keyof TourPackageFilters,
    value: TourPackageFilters[keyof TourPackageFilters]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const newFilters: TourPackageFilters = {};
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-6 p-4">
        {/* Tour Type */}
        <div className="space-y-2">
          <Label>Tour Type</Label>
          <div className="flex flex-wrap gap-2">
            {tourTypes.map((type) => (
              <Button
                key={type}
                variant={localFilters.type === type ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  handleChange('type', localFilters.type === type ? undefined : type)
                }
              >
                {type.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Min Price</Label>
              <Input
                type="number"
                min={0}
                value={localFilters.minPrice || ''}
                onChange={(e) =>
                  handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Max Price</Label>
              <Input
                type="number"
                min={0}
                value={localFilters.maxPrice || ''}
                onChange={(e) =>
                  handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-4">
          <Label>Duration (days)</Label>
          <Slider
            defaultValue={[localFilters.duration || 1]}
            min={1}
            max={30}
            step={1}
            onValueChange={([value]) => handleChange('duration', value)}
          />
          <div className="text-sm text-muted-foreground">
            {localFilters.duration || 1} days
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}; 