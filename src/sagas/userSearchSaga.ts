import { request } from "@octokit/request";
import { put, takeLatest, delay, select } from "redux-saga/effects";
import { selectUserSearchResult } from "./../slices/userSearchSlice";
import config from "../config";
import { User } from "./../types/types.d";
import { selectUserSearchQuery, setUserSearchQuery, setUserSearchResult } from "../slices/userSearchSlice";

const UPDATE_SEARCH = "UPDATE_SEARCH";
const LOAD_NEXT_RESULT = "LOAD_NEXT_RESULT";

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

export const loadNextResultAction = () => ({
  type: LOAD_NEXT_RESULT,
});

const maxSearchValueLength = 256;

function* updateSearchWatcher({ payload }: UpdateSearch): any {
  const { value } = payload;
  const currentQuery: string = yield select(selectUserSearchQuery);
  const formattedQuery = value.substring(0, maxSearchValueLength);

  if (currentQuery === formattedQuery) {
    return;
  }

  yield put(setUserSearchQuery(formattedQuery));

  if (!formattedQuery.length) {
    yield put(setUserSearchResult([]));
    return;
  }

  yield put(setUserSearchResult(null));

  // throttle
  yield delay(1000);
  yield put(loadNextResultAction());
}

const usersPerPage = 30;

function* loadNextResultWatcher(): any {
  const query: string = yield select(selectUserSearchQuery);
  const currentResult: User[] | null = yield select(selectUserSearchResult);
  const newResult = currentResult ? [...currentResult] : [];

  if (!query) {
    return;
  }

  const searchResponse = yield request("GET /search/users?q={query}&per_page={usersPerPage}", {
    headers: {
      authorization: `token ${config.token}`,
    },
    page: Math.max(1, Math.floor(newResult.length / usersPerPage) + 1),
    usersPerPage,
    query,
  });

  const userResponses = [];

  for (const basicUserInfo of searchResponse.data.items) {
    const userResponse = request("GET /user/{id}", {
      headers: {
        authorization: `token ${config.token}`,
      },
      id: basicUserInfo.id,
    });

    userResponses.push(userResponse);
  }

  const users = yield Promise.all(userResponses);
  users.forEach((user: any) => {
    newResult.push({
      login: user.data.login,
      name: user.data.name || "",
      email: user.data.email || "",
      location: user.data.location || "",
      avatar: user.data.avatar_url,
      joinDate: new Date(user.data.created_at),
      followers: user.data.followers,
      following: user.data.following,
      numberOfRepos: user.data.public_repos,
      bio: user.data.bio,
    });
  });

  const currentQuery: string = yield select(selectUserSearchQuery);

  if (currentQuery === query) {
    yield put(setUserSearchResult(newResult));
  }
}

function* userSearchSaga() {
  yield takeLatest(UPDATE_SEARCH, updateSearchWatcher);
  yield takeLatest(LOAD_NEXT_RESULT, loadNextResultWatcher);
}

export default userSearchSaga;
