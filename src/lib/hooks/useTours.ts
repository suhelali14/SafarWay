import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchTours,
  fetchTourById,
  createTour,
  updateTour,
  deleteTour,
  setFilters,
  clearFilters,
  clearSelectedTour,
} from '../store/slices/toursSlice';
import { useCallback } from 'react';
import { TourPackage, TourPackageFilters } from '../api/tours';

export const useTours = () => {
   const dispatch: AppDispatch = useDispatch();
  const { tours, selectedTour, loading, error, filters, totalPages, currentPage } = useSelector(
    (state: RootState) => state.tours
  );

  const getTours = useCallback(
    async (newFilters?: TourPackageFilters) => {
      try {
        await dispatch(fetchTours(newFilters || filters)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, filters]
  );

  const getTourById = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchTourById(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleCreateTour = useCallback(
    async (data: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await dispatch(createTour(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleUpdateTour = useCallback(
    async (id: string, data: Partial<TourPackage>) => {
      try {
        await dispatch(updateTour({ id, data })).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleDeleteTour = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteTour(id)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: TourPackageFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearTour = useCallback(() => {
    dispatch(clearSelectedTour());
  }, [dispatch]);

  return {
    tours,
    selectedTour,
    loading,
    error,
    filters,
    totalPages,
    currentPage,
    getTours,
    getTourById,
    createTour: handleCreateTour,
    updateTour: handleUpdateTour,
    deleteTour: handleDeleteTour,
    updateFilters,
    resetFilters,
    clearTour,
  };
}; 