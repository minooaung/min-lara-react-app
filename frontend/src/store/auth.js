import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: localStorage.getItem("ACCESS_TOKEN") || null,
};

const authSlice = createSlice({
  name: "authentication",
  //initialState: initialState,
  initialState, // Same as above, shortened
  reducers: {
    settingUser(state, action) {
      state.user = action.payload;
    },
    settingToken(state, action) {
      state.token = action.payload;

      if (action.payload) {
        localStorage.setItem("ACCESS_TOKEN", action.payload);
      } else {
        localStorage.removeItem("ACCESS_TOKEN");
      }
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
