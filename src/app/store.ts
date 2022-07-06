import userSearchSlice from "./../slices/userSearchSlice";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "../sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    userSearch: userSearchSlice,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
