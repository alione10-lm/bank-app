import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AuthUser: {},
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    Login(state, action) {
      state.AuthUser = action.payload;
      state.isAuth = true;
    },
    Logout(state) {
      state.AuthUser = {};
      state.isAuth = false;
    },
  },
});
export const { Login, Logout } = userSlice.actions;
export default userSlice.reducer;
