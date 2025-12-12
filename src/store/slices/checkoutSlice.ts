import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentMethod } from "../../types/payment";

export interface CheckoutState {
  bookingId: number | null;
  method: PaymentMethod | null;
  amount: number | null;
  currency: string | null;
  couponCode: string | null;
  discount: number | null;
}

const initialState: CheckoutState = {
  bookingId: null,
  method: null,
  amount: null,
  currency: "VND",
  couponCode: null,
  discount: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setBookingId: (state, action) => {
      state.bookingId = action.payload;
    },
    setMethod: (state, action) => {
      state.method = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },

    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },

    setDiscount: (state, action) => {
      state.discount = action.payload;
    },

    resetCheckout: () => initialState,
  },
});

export const {
  setBookingId,
  setMethod,
  setAmount,
  setCurrency,
  setCouponCode, 
  setDiscount, 
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
