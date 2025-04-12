import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toursApi, TourPackage, TourPackageFilters } from '../../api/tours';

interface ToursState {
  tours: TourPackage[];
  selectedTour: TourPackage | null;
  loading: boolean;
  error: string | null;
  filters: TourPackageFilters;
  totalPages: number;
  currentPage: number;
}

const initialState: ToursState = {
  tours: [],
  selectedTour: null,
  loading: false,
  error: null,
  filters: {},
  totalPages: 1,
  currentPage: 1,
};

export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (filters: TourPackageFilters) => {
    const response = await toursApi.getAll(filters);
    return response.data;
  }
);

export const fetchTourById = createAsyncThunk(
  'tours/fetchTourById',
  async (id: string) => {
    const response = await toursApi.getById(id);
    return response.data;
  }
);

export const createTour = createAsyncThunk(
  'tours/createTour',
  async (data: Omit<TourPackage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await toursApi.create(data);
    return response.data;
  }
);

export const updateTour = createAsyncThunk(
  'tours/updateTour',
  async ({ id, data }: { id: string; data: Partial<TourPackage> }) => {
    const response = await toursApi.update(id, data);
    return response.data;
  }
);

export const deleteTour = createAsyncThunk(
  'tours/deleteTour',
  async (id: string) => {
    await toursApi.delete(id);
    return id;
  }
);

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload.tours;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tours';
      })
      // Fetch Tour by ID
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTour = action.payload;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tour';
      })
      // Create Tour
      .addCase(createTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tours.push(action.payload);
      })
      .addCase(createTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create tour';
      })
      // Update Tour
      .addCase(updateTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTour.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tours.findIndex(tour => tour.id === action.payload.id);
        if (index !== -1) {
          state.tours[index] = action.payload;
        }
        if (state.selectedTour?.id === action.payload.id) {
          state.selectedTour = action.payload;
        }
      })
      .addCase(updateTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update tour';
      })
      // Delete Tour
      .addCase(deleteTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = state.tours.filter(tour => tour.id !== action.payload);
        if (state.selectedTour?.id === action.payload) {
          state.selectedTour = null;
        }
      })
      .addCase(deleteTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tour';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedTour, clearError } = toursSlice.actions;
export default toursSlice.reducer; 