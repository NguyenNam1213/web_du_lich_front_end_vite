import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlice";
import cityReducer from "./slices/citySlice";
import countryReducer from "./slices/countrySlice";
import destinationReducer from "./slices/destinationSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: userReducer,
    cities: cityReducer,
    countries: countryReducer,
    destinations: destinationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  console.log("State changed:", store.getState());
});
