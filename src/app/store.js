import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../features/home/homeSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from "../features/users/usersSlice";
import knowledgeBaseReducer from "../features/knowledge_bases/knowledgeBaseSlice";
import organisationReducer from "../features/organisations/organisationSlice";
import {logger} from "redux-logger/src";
import sourceReducer from "../features/sources/sourceSlice";

/**
 * Logs all actions and states after they are dispatched.
 */


export const store = configureStore({
  reducer: {
    homeReducer:homeReducer,
    authReducer: authReducer,
    usersReducer: usersReducer,
    kbReducer: knowledgeBaseReducer,
    organisationReducer: organisationReducer,
    sourceReducer: sourceReducer,
  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});
