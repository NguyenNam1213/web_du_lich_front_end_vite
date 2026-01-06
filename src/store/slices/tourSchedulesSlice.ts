import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TourScheduleRow {
  id: string;
  dateISO: string;     // "2026-01-20"
  dateLabel: string;   // "20/01/2026"
  startTime: string;   // "08:00"
  available: number;
  total: number;
}

interface TourSchedulesState {
  rows: TourScheduleRow[];
}

const initialState: TourSchedulesState = {
  rows: [],
};

const tourSchedulesSlice = createSlice({
  name: "tourSchedules",
  initialState,
  reducers: {
    setTourSchedules(state, action: PayloadAction<TourScheduleRow[]>) {
      state.rows = action.payload;
    },
    clearTourSchedules(state) {
      state.rows = [];
    },
  },
});

export const {
  setTourSchedules,
  clearTourSchedules,
} = tourSchedulesSlice.actions;

export default tourSchedulesSlice.reducer;
