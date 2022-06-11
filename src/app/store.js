import { configureStore } from '@reduxjs/toolkit';
import defaultReducer from '../features/default/DefaultSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from "../features/users/usersSlice";

/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

export const store = configureStore({
  reducer: {
    defaultApp:defaultReducer,
    authReducer: authReducer,
    usersReducer: usersReducer,
  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});
