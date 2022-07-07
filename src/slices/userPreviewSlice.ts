import { Repository, User } from "../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UsePreviewState {
  info: User | null;
  repos: Repository[] | null;
  reposSearchQuery: string;
}

const initialState: UsePreviewState = {
  info: null,
  repos: [],
  reposSearchQuery: "",
};

export const userPreviewSlice = createSlice({
  name: "userPreview",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.info = { ...action.payload };
    },
    setUserRepos: (state, action: PayloadAction<Repository[] | null>) => {
      state.repos = action.payload ? [...action.payload] : action.payload;
    },
    setReposSearchQuery: (state, action: PayloadAction<string>) => {
      state.reposSearchQuery = action.payload;
    },
  },
});

export const { setUserInfo, setUserRepos, setReposSearchQuery } = userPreviewSlice.actions;

export const selectUserInfo = (state: RootState) => state.userPreview.info;
export const selectUserRepos = (state: RootState) => state.userPreview.repos;
export const selectReposSearchQuery = (state: RootState) => state.userPreview.reposSearchQuery;

export default userPreviewSlice.reducer;
