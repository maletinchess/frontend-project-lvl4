/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

const socketApi = io();

export const newChannelThunk = createAsyncThunk(
  'newChannel',
  (newChannel) => socketApi.emit('newChannel', newChannel, (r) => {
    console.log(r);
  }),
);

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
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter((ch) => ch.id !== payload.id);
      state.currentChannelId = state.defaultChannelId;
    },
    renameChannel: (state, { payload }) => {
      console.log('slices.renameChannel:', payload);
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

  extraReducers: (builder) => {
    builder
      .addCase(newChannelThunk.fulfilled, (state, action) => {
        console.log(action);
      });
  },
});

export const {
  addChannel, loadChannels, removeChannel, renameChannel, loadChannelIds,
  setCurrentChannelId, setChannelLoadingState,
} = channelSlice.actions;

export default channelSlice.reducer;
