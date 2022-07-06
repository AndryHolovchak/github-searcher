import { all, fork } from "redux-saga/effects";
import userSearchSaga from "./userSearchSaga";

export function* rootSaga() {
  yield all([fork(userSearchSaga)]);
}
