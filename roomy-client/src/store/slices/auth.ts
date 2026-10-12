import { deleteAuthToken, setAuthToken } from "@/lib/cookies";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/auth";

type AuthState = {
  token?: string;
};
const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (_state) => {
      deleteAuthToken();
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (_state, { payload }) => {
      setAuthToken(payload.token);
      return { token: payload.token };
    });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
