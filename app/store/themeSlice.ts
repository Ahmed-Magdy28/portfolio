import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
  mode: Theme;
}

const isBrowser = typeof window !== "undefined";

const getInitialTheme = (): Theme => {
  if (!isBrowser) return "light";

  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const applyTheme = (theme: Theme) => {
  if (!isBrowser) return;

  localStorage.setItem("theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      applyTheme(state.mode);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      applyTheme(state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
