import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserSearchState {
  query: string;
  result: string[];
}

const initialState: UserSearchState = {
  query: "",
  result: [],
};

export const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    setUserSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { setUserSearchQuery } = userSearchSlice.actions;

export const selectUserSearchQuery = (state: RootState) => state.userSearch.query;

export default userSearchSlice.reducer;
