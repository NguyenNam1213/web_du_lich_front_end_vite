import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from "../../services/api/countryApi";
import { Country, CountryState } from "../../layouts/admin/types/country.type";

export const fetchCountries = createAsyncThunk<Country[]>(
  "countries/fetchCountries",
  async () => {
    const response = await getCountries();
    return response;
  }
);

export const createCountryAsync = createAsyncThunk<Country, Partial<Country>>(
  "countries/createCountry",
  async (countryData) => {
    const response = await createCountry(countryData);
    return response;
  }
);

export const updateCountryAsync = createAsyncThunk<
  Country,
  { code: string; countryData: Partial<Country> }
>("countries/updateCountry", async ({ code, countryData }) => {
  const response = await updateCountry(code, countryData);
  return response;
});

export const deleteCountryAsync = createAsyncThunk<string, string>(
  "countries/deleteCountry",
  async (code) => {
    await deleteCountry(code);
    return code;
  }
);

const initialState: CountryState = {
  countries: [],
  currentPage: 1,
  totalPages: 1,
  status: "idle",
  error: null,
};

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries = action.payload;
        state.totalPages = Math.ceil(action.payload.length / 10);
        state.currentPage = 1;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch countries";
      })
      .addCase(createCountryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCountryAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.countries.unshift(action.payload);
      })
      .addCase(createCountryAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create country";
      })
      .addCase(updateCountryAsync.fulfilled, (state, action) => {
        const updatedCountry = action.payload;
        const index = state.countries.findIndex(
          (country) => country.code === updatedCountry.code
        );
        if (index !== -1) {
          state.countries[index] = updatedCountry;
        }
      })
      .addCase(deleteCountryAsync.fulfilled, (state, action) => {
        state.countries = state.countries.filter(
          (country) => country.code !== action.payload
        );
      });
  },
});

export const { setCurrentPage } = countrySlice.actions;
export default countrySlice.reducer;

