import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../api/types";

const initialState: User | null = null;

const userSlice = createSlice({
  name: "user",
  initialState: initialState as User | null,
  reducers: {
    addUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    removeUser: (_state) => {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
