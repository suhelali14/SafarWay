import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  createBooking,
  fetchBookingById,
  fetchCustomerBookings,
  updateBookingStatus,
  cancelBooking,
  clearSelectedBooking,
} from '../store/slices/bookingsSlice';
import { useCallback } from 'react';
import { Booking, CreateBookingData } from '../api/bookings';

export const useBookings = () => {
  const dispatch: AppDispatch = useDispatch();
  const { bookings, selectedBooking, loading, error } = useSelector(
    (state: RootState) => state.bookings 
  );

  const handleCreateBooking = useCallback(
    async (data: CreateBookingData) => {
      try {
        await dispatch(createBooking(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const getBookingById = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchBookingById(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const getCustomerBookings = useCallback(async () => {
    try {
      await dispatch(fetchCustomerBookings()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleUpdateStatus = useCallback(
    async (id: string, status: Booking['status']) => {
      try {
        await dispatch(updateBookingStatus({ id, status })).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleCancelBooking = useCallback(
    async (id: string) => {
      try {
        await dispatch(cancelBooking(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const clearBooking = useCallback(() => {
    dispatch(clearSelectedBooking());
  }, [dispatch]);

  return {
    bookings,
    selectedBooking,
    loading,
    error,
    createBooking: handleCreateBooking,
    getBookingById,
    getCustomerBookings,
    updateStatus: handleUpdateStatus,
    cancelBooking: handleCancelBooking,
    clearBooking,
  };
}; 