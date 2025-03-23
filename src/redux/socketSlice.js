// src/store/slices/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  onlineUsers: {},
  chats: [],
  typingUsers: {}
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },

    addOnlineUsers: (state, { payload }) => {
      state.onlineUsers[payload?.userId] = true;
      const chat = state.chats.find((c) => c.userId === payload?.userId);
      if (chat) {
        chat.isOnline = true;
      }
    },

    removeOnlineUsers: (state, { payload }) => {
      delete state.onlineUsers[payload?.userId];
      const chat = state.chats.find((c) => c.userId === payload?.userId);
      if (chat) {
        chat.isOnline = false;
      }
    },

    setChats: (state, action) => {
      state.chats = action.payload || [];
    },

    setTyping: (state, { payload }) => {
      state.typingUsers[payload.chatId] = payload?.user;
    },

    removeTyping: (state, { payload }) => {
      delete state.typingUsers[payload?.chatId];
    },
  },
});

export const { setSocket, disconnectSocket, addOnlineUsers, removeOnlineUsers, setChats, setTyping, removeTyping } = socketSlice.actions;
export default socketSlice.reducer;
