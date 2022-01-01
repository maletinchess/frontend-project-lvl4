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
      console.log(state.chat);
    },
    addMessage: (state, { payload }) => {
      state.chat.messages.push(payload);
      console.log(payload);
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
  loadState, addMessage, switchCurrentChannel, resetMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
