import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  email: string;
  name: string;
}

const initialState: userState = {
  email: "",
  name : "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalEmail: (state , action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
  },
});

export const { setGlobalEmail } = userSlice.actions;

export default userSlice.reducer;