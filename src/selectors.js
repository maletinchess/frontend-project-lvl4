import { useSelector } from 'react-redux';

import { createSelector } from '@reduxjs/toolkit';

export const useGetState = () => useSelector((state) => state);

export const allSelector = (state) => state;

export const messagesSelector = (state) => state.messages.messages;

export const messagesCountSelector = (currentChannelId) => createSelector(
  messagesSelector,
  (items) => items.filter((message) => message.channelId === currentChannelId).length,
);

export const currentChannelIdSelector = (state) => state.channels.currentChannelId;

export const channelsSelector = (state) => state.channels.channels;
