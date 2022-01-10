import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice.js';
import messageReducer from './messageSlice.js';
import channelReducer from './channelSlice.js';

export default configureStore({
  reducer: {
    chat: chatReducer,
    messages: messageReducer,
    channels: channelReducer,
  },
});
