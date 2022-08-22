import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../features/home/homeSlice'
import authReducer from '../features/auth/authSlice'
import usersReducer from "../features/users/usersSlice";
import knowledgeBaseReducer from "../features/knowledge_bases/knowledgeBaseSlice";
import organisationReducer from "../features/organisations/organisationSlice";
import {logger} from "redux-logger/src";
import sourceReducer from "../features/sources/sourceSlice";
import groupReducer from "../features/groups/groupSlice"
import inventoryReducer from "../features/inventory/inventorySlice";
import statusSlice from "../features/status/statusSlice";
import documentSlice from "../features/document_management/documentSlice";

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
    groupReducer: groupReducer,
    inventoryReducer:inventoryReducer,
    statusReducer:statusSlice,
    documentReducer:documentSlice,
  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});