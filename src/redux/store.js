import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./authSlice";
import { authApi, contactApi, userApi } from "../api";

// Persist Configuration
const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["token", "user"],
};

// Persisted Reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: persistedAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      userApi.middleware,
      contactApi.middleware
    ]),
});

export const persistor = persistStore(store);
