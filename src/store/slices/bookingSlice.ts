import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking,
} from "../../services/api/bookingApi";
import {
  Booking,
  BookingState,
  FilterBookingDto,
  UpdateBookingStatusDto,
} from "../../layouts/admin/types/booking.type";

export const fetchBookings = createAsyncThunk<
  Booking[],
  FilterBookingDto | undefined
>("bookings/fetchBookings", async (filters) => {
  const response = await getBookings(filters);
  return response;
});

export const fetchBooking = createAsyncThunk<Booking, string>(
  "bookings/fetchBooking",
  async (id) => {
    const response = await getBooking(id);
    return response;
  }
);

export const updateBookingStatusAsync = createAsyncThunk<
  Booking,
  { id: string; data: UpdateBookingStatusDto }
>("bookings/updateBookingStatus", async ({ id, data }) => {
  const response = await updateBookingStatus(id, data);
  return response;
});

export const deleteBookingAsync = createAsyncThunk<string, string>(
  "bookings/deleteBooking",
  async (id) => {
    await deleteBooking(id);
    return id;
  }
);

const initialState: BookingState = {
  bookings: [],
  currentPage: 1,
  totalPages: 1,
  status: "idle",
  error: null,
  filters: {},
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10);
        state.currentPage = 1;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch bookings";
      })
      .addCase(updateBookingStatusAsync.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(
          (booking) => booking.id === updatedBooking.id
        );
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })
      .addCase(deleteBookingAsync.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      });
  },
});

export const { setCurrentPage, setFilters, clearFilters } = bookingSlice.actions;
export default bookingSlice.reducer;

