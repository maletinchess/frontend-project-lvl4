import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice.js';
import channelReducer from './channelSlice.js';
import modalSliceReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    messages: messageReducer,
    channels: channelReducer,
    modals: modalSliceReducer,
  },
});
