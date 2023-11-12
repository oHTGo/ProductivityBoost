import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@shared/common/store';
import type { Feature } from '@shared/types/commons';

interface SidebarState {
  isOpen: boolean;
  isExpanded: boolean;
  ui: '' | Feature;
}
const initialState: SidebarState = {
  isOpen: false,
  isExpanded: false,
  ui: '',
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
      state.ui = '';
    },
    expand: (state) => {
      state.isExpanded = true;
    },
    collapse: (state) => {
      state.isExpanded = false;
      state.ui = '';
    },
    setUI: (state, action: PayloadAction<Feature>) => {
      state.ui = action.payload;
    },
  },
});
export const { toggle, open, close, expand, collapse, setUI } = sidebarSlice.actions;
export const getIsOpen = ({ sidebar }: RootState) => sidebar.isOpen;
export const getIsExpanded = ({ sidebar }: RootState) => sidebar.isExpanded;
export const getUI = ({ sidebar }: RootState) => sidebar.ui;
export const reducer = sidebarSlice.reducer;
export default sidebarSlice;
