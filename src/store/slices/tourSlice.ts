// store/slices/tourSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '../../types/activity';
import { ActivityService } from '../../api/activity.service';

interface TourState {
  tours: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: TourState = {
  tours: [],
  loading: false,
  error: null,
};

// Async thunk để fetch tours
export const fetchTours = createAsyncThunk(
  'tour/fetchTours',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ActivityService.getAllTour();
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching tours');
    }
  }
);

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    // Action để set tours trực tiếp (nếu cần)
    setTours: (state, action: PayloadAction<Activity[]>) => {
      state.tours = action.payload;
    },
    // Action để clear tours
    clearTours: (state) => {
      state.tours = [];
      state.error = null;
    },
    // Action để update một tour cụ thể
    updateTour: (state, action: PayloadAction<Activity>) => {
      const index = state.tours.findIndex(tour => tour.id === action.payload.id);
      if (index !== -1) {
        state.tours[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTours, clearTours, updateTour } = tourSlice.actions;
export default tourSlice.reducer;