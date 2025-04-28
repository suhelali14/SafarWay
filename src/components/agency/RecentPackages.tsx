
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackageItem {
  id: string;
  title: string;
  destination: string;
  price: number;
  rating: number;
  totalReviews: number;
  status: 'active' | 'draft' | 'archived';
  imageUrl: string;
}

interface RecentPackagesProps {
  packages: PackageItem[];
}

export function RecentPackages({ packages }: RecentPackagesProps) {
  // Status color mapping
  const statusColor = {
    active: 'bg-emerald-100 text-emerald-800',
    draft: 'bg-amber-100 text-amber-800',
    archived: 'bg-slate-100 text-slate-800',
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Packages</CardTitle>
          <CardDescription>Your recently created travel packages</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link to="/agency/packages">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {packages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No packages available. Create your first package to get started.
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={pkg.imageUrl || '/placeholder-package.jpg'}
                    alt={pkg.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{pkg.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={statusColor[pkg.status]} 
                      label= {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}>
                      
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {pkg.destination}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-medium">${pkg.price.toLocaleString()}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                      <span className="text-xs text-muted-foreground">
                        {pkg.rating.toFixed(1)} ({pkg.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 