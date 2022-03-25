import { createSelector } from '@reduxjs/toolkit';

export const selectAll = (state) => state;

export const selectMessages = (state) => state.messages.messages;

export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export const selectCurrentMessages = createSelector(
  selectMessages,
  selectCurrentChannelId,
  (messages, id) => messages.filter((message) => message.channelId === id),
);

export const selectChannels = (state) => state.channels.channels;

export const selectModalInfo = (state) => state.modals.modalInfo;
