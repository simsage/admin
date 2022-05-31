import { configureStore } from '@reduxjs/toolkit';
import defaultReducer from '../features/default/DefaultSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    defaultApp:defaultReducer,
    authReducer: authReducer,
    usersReducer: usersReducer,
  },
});
