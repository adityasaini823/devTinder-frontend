import { createSlice } from "@reduxjs/toolkit";
export const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    setFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      const newArray = state.filter((req) => req._id !== action.payload);
      return newArray; // ✅ Use request_id for filtering
    },
  },
});
export const { setFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
