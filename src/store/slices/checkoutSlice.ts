import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentMethod } from "../../types/payment";

export interface CheckoutState {
  bookingId: number | null;
  method: PaymentMethod | null;
  amount: number | null;
  currency: string | null;
}

const initialState: CheckoutState = {
  bookingId: null,
  method: null,
  amount: null,
  currency: "VND",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setBookingId: (state, action: PayloadAction<number>) => {
      state.bookingId = action.payload;
    },
    setMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.method = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setBookingId,
  setMethod,
  setAmount,
  setCurrency,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
