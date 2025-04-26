
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingItem {
  id: string;
  bookingId: string;
  customerName: string;
  packageName: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

interface RecentBookingsProps {
  bookings: BookingItem[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  // Status color mapping
  const statusColor = {
    confirmed: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-rose-100 text-rose-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest tour package bookings</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link to="/agency/bookings">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent bookings available.
            </div>
          ) : (
            <div className="grid gap-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="grid grid-cols-5 items-center text-sm p-2 rounded-md hover:bg-muted/50">
                  <div className="col-span-2">
                    <p className="font-medium truncate">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{booking.packageName}</p>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="font-medium">
                    ${booking.amount.toLocaleString()}
                  </div>
                  <div className="flex justify-end">
                    <Badge
                      variant="outline"
                      className={statusColor[booking.status]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 