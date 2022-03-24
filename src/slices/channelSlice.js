/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
  defaultChannelId: null,
  loading: 'idle',
};

export const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    newChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((ch) => ch.id !== payload.id);
      state.currentChannelId = state.defaultChannelId;
    },
    renameChannel: (state, { payload }) => {
      const channelToRename = state.channels.find((ch) => ch.id === payload.id);
      channelToRename.name = payload.name;
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
    setChannelLoadingState: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const {
  newChannel, loadChannels, removeChannel, renameChannel, loadChannelIds,
  setCurrentChannelId, setChannelLoadingState,
} = channelSlice.actions;

export default channelSlice.reducer;
