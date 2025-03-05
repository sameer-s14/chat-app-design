import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import authReducer from "./authSlice";
import socketReducer from "./socketSlice";
import { authApi, chatApi, contactApi, contactsApi, userApi } from "../api";

// Persist Configuration for Auth (User Token & Data)
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["token", "user"], // Persist user & token
};

// Persist Configuration for Contacts (Offline Support)
const contactPersistConfig = {
  key: "contacts",
  storage: AsyncStorage,
  whitelist: ["contacts"], // Store contacts locally
};

// Persisted Reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: persistedAuthReducer,
    socket: socketReducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      userApi.middleware,
      contactsApi.middleware,
      chatApi.middleware
    ]),
});

export const persistor = persistStore(store);

// Function to Save Offline Contacts Locally
const saveOfflineContact = async (contact) => {
  try {
    let pendingContacts = await AsyncStorage.getItem("pendingContacts");
    pendingContacts = pendingContacts ? JSON.parse(pendingContacts) : [];

    pendingContacts.push(contact); // Add new contact to pending list
    await AsyncStorage.setItem("pendingContacts", JSON.stringify(pendingContacts));
    console.log("Contact saved for offline sync:", contact);
  } catch (error) {
    console.error("Error saving contact offline:", error);
  }
};

// Function to Sync Contacts When Internet is Back
const syncContacts = async () => {
  const netInfo = await NetInfo.fetch();

  if (netInfo.isConnected) {
    let pendingContacts = await AsyncStorage.getItem("pendingContacts");
    pendingContacts = pendingContacts ? JSON.parse(pendingContacts) : [];

    if (pendingContacts.length > 0) {
      for (const contact of pendingContacts) {
        await store.dispatch(contactApi.endpoints.addUserContact.initiate(contact));
      }
      await AsyncStorage.removeItem("pendingContacts"); // Clear after syncing
      console.log("Offline contacts synced successfully");
    }
  }
};

// Listen for Network Changes & Sync Contacts
NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    syncContacts();
  }
});

export { saveOfflineContact };
