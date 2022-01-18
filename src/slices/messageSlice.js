/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

import { removeChannel } from './channelSlice.js';

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
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload }) => {
      state.messages = state.messages.filter((m) => m.id !== payload);
    });
  },
});

export const { addMessage, loadMessages } = messageSlice.actions;

export default messageSlice.reducer;
