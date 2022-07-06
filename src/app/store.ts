import { configureStore } from "@reduxjs/toolkit";
import userSearchSlice from "./../slices/userSearchSlice";

export const store = configureStore({
  reducer: {
    userSearch: userSearchSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
