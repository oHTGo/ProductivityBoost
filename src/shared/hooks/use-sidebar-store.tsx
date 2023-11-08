import { createContext } from 'react';
import { createStore } from 'zustand';

type SidebarState = {
  isOpen: boolean;
  set: (state: boolean) => void;
  toggle: () => void;
};
const useCreateSidebarStore = createStore<SidebarState>()((set) => ({
  isOpen: false,
  set: (state) => set({ isOpen: state }),
  toggle: () => set(({ isOpen }) => ({ isOpen: !isOpen })),
}));
const context = createContext<typeof useCreateSidebarStore | null>(null);

export { useCreateSidebarStore, context };
