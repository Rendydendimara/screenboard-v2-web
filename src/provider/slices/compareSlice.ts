import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppPublic } from "@/pages/Home/useController";

interface CompareState {
  compareApps: AppPublic[];
}

// Load initial state from localStorage
const loadCompareFromStorage = (): AppPublic[] => {
  try {
    const storedCompare = localStorage.getItem("compareApps");
    return storedCompare ? JSON.parse(storedCompare) : [];
  } catch (error) {
    console.error("Error loading compare apps from localStorage:", error);
    return [];
  }
};

const initialState: CompareState = {
  compareApps: loadCompareFromStorage(),
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<AppPublic>) => {
      // Check if app is already in compare list
      const exists = state.compareApps.some(
        (app) => app.id === action.payload.id
      );

      // Only add if not exists and less than 2 apps
      if (!exists && state.compareApps.length < 2) {
        state.compareApps.push(action.payload);
        // Save to localStorage
        localStorage.setItem("compareApps", JSON.stringify(state.compareApps));
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.compareApps = state.compareApps.filter(
        (app) => app.id !== action.payload
      );
      // Save to localStorage
      localStorage.setItem("compareApps", JSON.stringify(state.compareApps));
    },
    clearCompare: (state) => {
      state.compareApps = [];
      // Clear from localStorage
      localStorage.removeItem("compareApps");
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;
