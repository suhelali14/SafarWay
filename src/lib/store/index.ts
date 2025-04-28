import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inviteReducer from './slices/inviteSlice';
import bookingsReducer from './slices/bookingsSlice';
import toursReducer from './slices/toursSlice'; // Ensure this import is correct
import uiReducer from './slices/uiSlice'; // Ensure this import is correct
export const store = configureStore({
  reducer: {
    auth: authReducer,
    invite: inviteReducer,
    bookings: bookingsReducer, // Ensure this is included
    tours: toursReducer, // Ensure this is included
    ui: uiReducer, // Add the 'ui' slice to the RootState type
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



