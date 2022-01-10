/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat: {

  },
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    loadState: (state, action) => {
      state.chat = action.payload;
    },
    addMessage: (state, { payload }) => {
      state.chat.messages.push(payload);
    },
    switchCurrentChannel: (state, { payload }) => {
      state.chat.currentChannelId = payload;
    },
    resetMessages: (state) => {
      state.chat.messsages = [];
    },
  },
});

export const {
  loadState, switchCurrentChannel, resetMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
