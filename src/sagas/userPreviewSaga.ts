import { Repository, User } from "./../types/types.d";
import { put, takeLatest, select } from "redux-saga/effects";
import config from "../config";

import { request } from "@octokit/request";
import {
  selectUserInfo,
  selectUserRepos,
  setReposSearchQuery,
  setUserInfo,
  setUserRepos,
} from "../slices/userPreviewSlice";

const CHANGE_PREVIEW_USER = "CHANGE_PREVIEW_USER";
const LOAD_USER_REPOS = "LOAD_USER_REPOS";

interface ChangePreviewUserPayload {
  data: User;
}

interface ChangePreviewUser {
  type: typeof CHANGE_PREVIEW_USER;
  payload: ChangePreviewUserPayload;
}

interface LoadUserRepos {
  type: typeof LOAD_USER_REPOS;
}

export const changePreviewUserAction = (payload: ChangePreviewUserPayload): ChangePreviewUser => ({
  type: CHANGE_PREVIEW_USER,
  payload,
});

export const loadUserReposAction = (): LoadUserRepos => ({ type: LOAD_USER_REPOS });

function* changePreviewUserWatcher({ payload }: ChangePreviewUser): any {
  const { data } = payload;

  yield put(setUserRepos(null));
  yield put(setReposSearchQuery(""));
  yield put(setUserInfo(data));
}

const reposPerPage = 30;

function* loadUserReposWatcher(): any {
  const userInfo: User | null = yield select(selectUserInfo);

  if (!userInfo) {
    return;
  }

  const repos: Repository[] | null = yield select(selectUserRepos);
  const newRepos = repos ? [...repos] : [];

  const reposResponse = yield request("GET /users/{login}/repos?per_page={reposPerPage}&page={page}", {
    headers: {
      authorization: `token ${config.token}`,
    },
    reposPerPage,
    page: Math.max(1, Math.floor(newRepos.length / reposPerPage) + 1),
    login: userInfo.login,
  });

  for (const repo of reposResponse.data) {
    newRepos.push({
      name: repo.name,
      forks: repo.forks,
      stars: repo.stargazers_count,
    });
  }

  yield put(setUserRepos(newRepos));

  //load next page
  if (reposResponse.data.length >= reposPerPage) {
    yield put(loadUserReposAction());
  }
}

function* userPreviewSaga() {
  yield takeLatest(CHANGE_PREVIEW_USER, changePreviewUserWatcher);
  yield takeLatest(LOAD_USER_REPOS, loadUserReposWatcher);
}

export default userPreviewSaga;
