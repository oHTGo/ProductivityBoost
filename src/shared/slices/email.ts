import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@shared/common/store';
import type { IEmail } from '@shared/interfaces/email';

interface EmailState {
  emails: IEmail[];
}
const initialState: EmailState = {
  emails: [],
};

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmails: (state, action: PayloadAction<IEmail[]>) => {
      state.emails = action.payload;
    },
  },
});
export const { setEmails } = emailSlice.actions;
export const getEmails = ({ email }: RootState) => email.emails;
export const reducer = emailSlice.reducer;
export default emailSlice;
