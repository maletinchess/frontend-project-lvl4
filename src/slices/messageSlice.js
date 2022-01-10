/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    loadMessages: (state, { payload }) => {
      state.messages = payload;
    },
  },
});

export const { addMessage, loadMessages } = messageSlice.actions;

export default messageSlice.reducer;
