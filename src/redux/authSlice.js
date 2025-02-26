import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateUserDetails: (state, action) => {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, logout, updateUserDetails } = authSlice.actions;
export default authSlice.reducer;
