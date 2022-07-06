import { UserInfo } from "./../types/types.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserSearchState {
  query: string;
  isLoading: boolean;
  result: UserInfo[];
}

const initialState: UserSearchState = {
  query: "",
  isLoading: false,
  result: [],
};

export const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    setUserSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setUserSearchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserSearchResult: (state, action: PayloadAction<UserInfo[]>) => {
      state.result = [...action.payload];
    },
  },
});

export const { setUserSearchQuery, setUserSearchIsLoading, setUserSearchResult } = userSearchSlice.actions;

export const selectUserSearchQuery = (state: RootState) => state.userSearch.query;
export const selectUserSearchIsLoading = (state: RootState) => state.userSearch.isLoading;
export const selectUserSearchResult = (state: RootState) => state.userSearch.result;

export default userSearchSlice.reducer;
