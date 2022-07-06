import { UserInfo } from "./../types/types.d";
import { put, takeLatest, delay } from "redux-saga/effects";
import config from "../config";
import { setUserSearchIsLoading, setUserSearchQuery, setUserSearchResult } from "../slices/userSearchSlice";

import { request } from "@octokit/request";

const UPDATE_SEARCH = "UPDATE_SEARCH";

interface UpdateSearchPayload {
  value: string;
}

interface UpdateSearch {
  type: typeof UPDATE_SEARCH;
  payload: UpdateSearchPayload;
}

export const updateSearchAction = (payload: UpdateSearchPayload): UpdateSearch => ({
  type: UPDATE_SEARCH,
  payload,
});

function* updateSearchWatcher({ payload }: UpdateSearch): any {
  const { value } = payload;
  yield put(setUserSearchQuery(value));

  if (!value.length) {
    yield put(setUserSearchResult([]));
    yield put(setUserSearchIsLoading(false));
    return;
  }

  yield put(setUserSearchIsLoading(true));

  // throttle
  yield delay(1000);

  const searchResponse = yield request("GET /search/users?q={query}", {
    headers: {
      authorization: `token ${config.token}`,
    },
    query: value,
  });

  const userResponses = [];

  for (const basicUserInfo of searchResponse.data.items) {
    const userResponse = request("GET /users/{login}", {
      headers: {
        authorization: `token ${config.token}`,
      },
      login: basicUserInfo.login,
    });

    userResponses.push(userResponse);
  }

  const users = yield Promise.all(userResponses);
  const result: UserInfo[] = users.map((user: any) => ({
    name: user.data.name || user.data.login,
    email: user.data.email || "no email",
    location: user.data.location || "no location",
    avatar: user.data.avatar_url,
    joinDate: new Date(user.data.created_at),
    followers: user.data.followers,
    following: user.data.following,
    numberOfRepos: user.data.public_repos,
  }));

  yield put(setUserSearchResult(result));
  yield put(setUserSearchIsLoading(false));
}

function* userSearchSaga() {
  yield takeLatest(UPDATE_SEARCH, updateSearchWatcher);
}

export default userSearchSaga;
