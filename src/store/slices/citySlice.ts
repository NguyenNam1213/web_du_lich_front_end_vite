import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from "../../services/api/cityApi";
import { City, CityState } from "../../layouts/admin/types/city.type";

export const fetchCities = createAsyncThunk<City[]>(
  "cities/fetchCities",
  async () => {
    const response = await getCities();
    return response;
  }
);

export const createCityAsync = createAsyncThunk<City, Partial<City>>(
  "cities/createCity",
  async (cityData) => {
    const response = await createCity(cityData);
    return response;
  }
);

export const updateCityAsync = createAsyncThunk<
  City,
  { id: string; cityData: Partial<City> }
>("cities/updateCity", async ({ id, cityData }) => {
  const response = await updateCity(id, cityData);
  return response;
});

export const deleteCityAsync = createAsyncThunk<string, string>(
  "cities/deleteCity",
  async (id) => {
    await deleteCity(id);
    return id;
  }
);

const initialState: CityState = {
  cities: [],
  currentPage: 1,
  totalPages: 1,
  status: "idle",
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cities = action.payload;
        // Simple pagination: 10 items per page
        state.totalPages = Math.ceil(action.payload.length / 10);
        state.currentPage = 1;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cities";
      })
      .addCase(createCityAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCityAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cities.unshift(action.payload);
      })
      .addCase(createCityAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create city";
      })
      .addCase(updateCityAsync.fulfilled, (state, action) => {
        const updatedCity = action.payload;
        const index = state.cities.findIndex(
          (city) => city.id === updatedCity.id
        );
        if (index !== -1) {
          state.cities[index] = updatedCity;
        }
      })
      .addCase(deleteCityAsync.fulfilled, (state, action) => {
        state.cities = state.cities.filter((city) => city.id !== action.payload);
      });
  },
});

export const { setCurrentPage } = citySlice.actions;
export default citySlice.reducer;

