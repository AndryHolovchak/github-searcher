import { all, fork } from "redux-saga/effects";
import userPreviewSaga from "./userPreviewSaga";
import userSearchSaga from "./userSearchSaga";

export function* rootSaga() {
  yield all([fork(userSearchSaga), fork(userPreviewSaga)]);
}
