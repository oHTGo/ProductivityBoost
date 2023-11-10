import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@shared/common/store';

interface SidebarState {
  isOpen: boolean;
}
const initialState: SidebarState = {
  isOpen: false,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    set: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});
export const { toggle, set } = sidebarSlice.actions;
export const getIsOpen = ({ sidebar }: RootState) => sidebar.isOpen;
export const reducer = sidebarSlice.reducer;
export default sidebarSlice;
