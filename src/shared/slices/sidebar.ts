import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@shared/common/store';

interface SidebarState {
  isOpen: boolean;
  isExpanded: boolean;
}
const initialState: SidebarState = {
  isOpen: false,
  isExpanded: false,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    open: (state) => {
      state.isOpen = true;
      state.isExpanded = false;
    },
    close: (state) => {
      state.isOpen = false;
      state.isExpanded = false;
    },
    expand: (state) => {
      state.isExpanded = true;
    },
    collapse: (state) => {
      state.isExpanded = false;
    },
  },
});
export const { toggle, open, close, expand, collapse } = sidebarSlice.actions;
export const getIsOpen = ({ sidebar }: RootState) => sidebar.isOpen;
export const getIsExpanded = ({ sidebar }: RootState) => sidebar.isExpanded;
export const reducer = sidebarSlice.reducer;
export default sidebarSlice;
