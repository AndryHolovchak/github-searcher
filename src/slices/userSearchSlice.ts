import { User } from "./../types/types.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserSearchState {
  query: string;
  result: User[] | null;
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
    setUserSearchResult: (state, action: PayloadAction<User[] | null>) => {
      state.result = action.payload ? [...action.payload] : action.payload;
    },
  },
});

export const { setUserSearchQuery, setUserSearchResult } = userSearchSlice.actions;

export const selectUserSearchQuery = (state: RootState) => state.userSearch.query;
export const selectUserSearchResult = (state: RootState) => state.userSearch.result;

export default userSearchSlice.reducer;
