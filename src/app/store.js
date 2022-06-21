import { configureStore } from '@reduxjs/toolkit';
import defaultReducer from '../features/home/DefaultSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from "../features/users/usersSlice";
import knowledgeBaseReducer from "../features/knowledge_bases/knowledgeBaseSlice";
import organisationReducer from "../features/organisations/organisationSlice";
import {logger} from "redux-logger/src";

/**
 * Logs all actions and states after they are dispatched.
 */


export const store = configureStore({
  reducer: {
    defaultApp:defaultReducer,
    authReducer: authReducer,
    usersReducer: usersReducer,
    kbReducer: knowledgeBaseReducer,
    organisationReducer: organisationReducer,
  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});
