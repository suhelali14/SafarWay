import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types/Booking';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Helmet } from 'react-helmet-async';

export function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Loading bookings...</h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Bookings | SafarWay</title>
        <meta name="description" content="View and manage your travel bookings on SafarWay" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <Button onClick={() => navigate('/packages')}>
              Browse Packages
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{booking.packageName}</h3>
                <p className="text-gray-600 mb-2">Status: {booking.status}</p>
                <p className="text-gray-600 mb-4">Date: {new Date(booking.date).toLocaleDateString()}</p>
                <Button variant="outline" onClick={() => navigate(`/bookings/${booking.id}`)}>
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 