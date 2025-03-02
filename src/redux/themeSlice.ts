import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeType = "light" | "dark" | "blue" | "red" | "green";

type ThemeState = {
  currentTheme: ThemeType;
  themes: Record<ThemeType, { background: string; text: string; primary: string }>;
};

const initialState: ThemeState = {
  currentTheme: "light",
  themes: {
    light: { background: "#ffffff", text: "#000000", primary: "#3498db" },
    dark: { background: "#222222", text: "#ffffff", primary: "#e67e22" },
    blue: { background: "#d0ebff", text: "#003366", primary: "#0056b3" },
    red: { background: "#ffe6e6", text: "#990000", primary: "#e74c3c" },
    green: { background: "#e6ffe6", text: "#004d00", primary: "#2ecc71" },
  },
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
