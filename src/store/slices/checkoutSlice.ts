import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentMethod } from "../../types/payment";

export interface CheckoutState {
  bookingId: number | null;
  method: PaymentMethod | null;
  amount: number | null;
  currency: string | null;
  couponCode: string | null;
  discount: number | null;
  agreeTerms: boolean;

  tourId?: number;
  tourName?: string;
  tourImage?: string;
  bookingDate?: string;
  participants?: number;
}

const initialState: CheckoutState = {
  bookingId: null,
  method: null,
  amount: null,
  currency: "VND",
  couponCode: null,
  discount: null,
  agreeTerms: false,
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

    setTourId: (state, action) => {
      state.tourId = action.payload;
    },
    setTourName: (state, action) => {
      state.tourName = action.payload;
    },
    setTourImage: (state, action) => {
      state.tourImage = action.payload; 
    },
    setBookingDate: (state, action) => {
      state.bookingDate = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },

    setAgreeTerms: (state, action: PayloadAction<boolean>) => {
      state.agreeTerms = action.payload
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
  setTourId,
  setTourName,
  setTourImage,
  setBookingDate,
  setParticipants,
  setAgreeTerms, 
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
