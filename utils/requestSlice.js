import { createSlice } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    addRequests: {
      reducer: (state, action) => action.payload,
    },
    removeRequest: (state, action) => {
      const newArray = state.filter((req) => req.request_id !== action.payload);
      return newArray; // ✅ Use request_id for filtering
    },
  },
});
export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;
