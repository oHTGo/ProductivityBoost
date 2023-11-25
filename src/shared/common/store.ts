import { configureStore } from '@reduxjs/toolkit';
import { reducer as emailReducer } from '@shared/slices/email';
import { reducer as sidebarReducer } from '@shared/slices/sidebar';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    email: emailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
