/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalInfo: { type: null, item: null },
};

export const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    addModal: (state) => {
      state.modalInfo.type = 'adding';
    },
    removeModal: (state, { payload }) => {
      state.modalInfo.type = 'removing';
      state.modalInfo.item = { id: payload };
    },
    renameModal: (state, { payload }) => {
      state.modalInfo.type = 'renaming';
      state.modalInfo.item = payload;
    },
    hideModal: (state) => {
      state.modalInfo.type = null;
      state.modalInfo.item = null;
    },
  },
});

export const {
  addModal, hideModal, removeModal, renameModal,
} = modalSlice.actions;

export default modalSlice.reducer;
