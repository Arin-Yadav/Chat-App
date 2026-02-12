import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/user/userSlice";
import sessionStorage from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";
// import { roomSlice } from "./redux/room/roomSlice";

const rootReducer = combineReducers({
  user: userReducer,
  // room: roomSlice,
});

const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
