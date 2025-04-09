import { createSlice } from "@reduxjs/toolkit";

export const connectSlice = createSlice({
  name: "connection",
  initialState: [],
  reducers: {
    addConnections: {
      reducer: (state, action) => action.payload,
    },
    newConnection: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
    },
  },
});
export const { addConnections, newConnection } = connectSlice.actions;
export default connectSlice.reducer;
