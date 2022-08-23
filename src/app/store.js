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
import botSlice from "../features/bot/botSlice";
import synonymSlice from "../features/synonyms/synonymSlice";
import semanticSlice from "../features/semantics/semanticSlice";
import synsetSlice from "../features/synsets/synsetSlice";
import categorizationSlice from "../features/categorization/categorizationSlice";

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
    botReducer:botSlice,
    synonymReducer:synonymSlice,
    semanticReducer:semanticSlice,
    synsetReducer:synsetSlice,
    categorizationReducer:categorizationSlice,

  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});