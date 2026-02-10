import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch messages for a room
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (roomId) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/messages/${roomId}`,
      {
        withCredentials: true,
      },
    );
    // ✅ Make sure this returns an array
    return { roomId, messages: res.data.messages || res.data };
  },
);

// Send new message (persist to DB)
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData) => {
    const res = await axios.post("/messages", messageData);
    return res.data;
  },
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    byRoom: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  reducers: {
    // For real-time socket updates
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.byRoom[roomId]) state.byRoom[roomId] = [];
      state.byRoom[roomId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.byRoom[action.payload.roomId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const msg = action.payload;
        if (!state.byRoom[msg.roomId]) state.byRoom[msg.roomId] = [];
        state.byRoom[msg.roomId].push(msg);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
