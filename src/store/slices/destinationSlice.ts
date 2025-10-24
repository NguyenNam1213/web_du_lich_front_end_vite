import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../../services/api/destinationApi";
import {
  Destination,
  DestinationState,
} from "../../layouts/admin/types/destination.type";

export const fetchDestinations = createAsyncThunk<Destination[]>(
  "destinations/fetchDestinations",
  async () => {
    const response = await getDestinations();
    return response;
  }
);

export const createDestinationAsync = createAsyncThunk<
  Destination,
  Partial<Destination>
>("destinations/createDestination", async (destinationData) => {
  const response = await createDestination(destinationData);
  return response;
});

export const updateDestinationAsync = createAsyncThunk<
  Destination,
  { id: string; destinationData: Partial<Destination> }
>("destinations/updateDestination", async ({ id, destinationData }) => {
  const response = await updateDestination(id, destinationData);
  return response;
});

export const deleteDestinationAsync = createAsyncThunk<string, string>(
  "destinations/deleteDestination",
  async (id) => {
    await deleteDestination(id);
    return id;
  }
);

const initialState: DestinationState = {
  destinations: [],
  currentPage: 1,
  totalPages: 1,
  status: "idle",
  error: null,
};

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.destinations = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10);
        state.currentPage = 1;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch destinations";
      })
      .addCase(createDestinationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDestinationAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.destinations.unshift(action.payload);
      })
      .addCase(createDestinationAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create destination";
      })
      .addCase(updateDestinationAsync.fulfilled, (state, action) => {
        const updatedDestination = action.payload;
        const index = state.destinations.findIndex(
          (destination) => destination.id === updatedDestination.id
        );
        if (index !== -1) {
          state.destinations[index] = updatedDestination;
        }
      })
      .addCase(deleteDestinationAsync.fulfilled, (state, action) => {
        state.destinations = state.destinations.filter(
          (destination) => destination.id !== action.payload
        );
      });
  },
});

export const { setCurrentPage } = destinationSlice.actions;
export default destinationSlice.reducer;

