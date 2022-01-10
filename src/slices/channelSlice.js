/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
};

export const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    loadChannels: (state, { payload }) => {
      state.channels = payload;
    },
  },
});

export const { addChannel, loadChannels } = channelSlice.actions;

export default channelSlice.reducer;
