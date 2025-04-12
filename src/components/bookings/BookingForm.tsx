import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { LoadingOverlay } from '../ui/spinner';
import { TourPackage } from '../../lib/api/tours';
import { CreateBookingData } from '../../lib/api/bookings';

const bookingSchema = z.object({
  startDate: z.date({
    required_error: 'Please select a date',
  }),
  numberOfPeople: z.number({
    required_error: 'Please enter number of people',
  }).min(1, 'Minimum 1 person required').max(50, 'Maximum 50 people allowed'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  tour: TourPackage;
  onSubmit: (data: CreateBookingData) => Promise<void>;
  loading?: boolean;
}

export const BookingForm = ({ tour, onSubmit, loading }: BookingFormProps) => {
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const numberOfPeople = watch('numberOfPeople') || 1;
  const totalPrice = tour.pricePerPerson * numberOfPeople;

  const onFormSubmit = async (data: BookingFormData) => {
    await onSubmit({
      tourPackageId: tour.id,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      numberOfPeople: data.numberOfPeople,
    });
  };

  return (
    <LoadingOverlay loading={loading || false}>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
                if (date) {
                  setValue('startDate', date);
                }
              }}
              disabled={(date) =>
                date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              }
              className="rounded-md border"
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPeople">Number of People</Label>
            <Input
              id="numberOfPeople"
              type="number"
              min={1}
              max={tour.maxGroupSize}
              {...register('numberOfPeople', { valueAsNumber: true })}
            />
            {errors.numberOfPeople && (
              <p className="text-sm text-destructive">
                {errors.numberOfPeople.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per person</span>
              <span>₹{tour.pricePerPerson}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total price</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Book Now
          </Button>
        </form>
      </Card>
    </LoadingOverlay>
  );
}; 