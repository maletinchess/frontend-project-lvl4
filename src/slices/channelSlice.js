/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
  defaultChannelId: null,
};

export const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((ch) => ch.id !== payload);
      state.currentChannelId = state.defaultChannelId;
    },
    loadChannels: (state, { payload }) => {
      state.channels = payload;
    },
    loadChannelIds: (state, { payload }) => {
      state.currentChannelId = payload;
      state.defaultChannelId = payload;
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const {
  addChannel, loadChannels, removeChannel, loadChannelIds, setCurrentChannelId,
} = channelSlice.actions;

export default channelSlice.reducer;
