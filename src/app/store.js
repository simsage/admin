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
import documentSlice from "../features/document_management/documentSlice";
import synonymSlice from "../features/synonyms/synonymSlice";
import semanticSlice from "../features/semantics/semanticSlice";
import synsetSlice from "../features/synsets/synsetSlice";
import alertSlice from "../features/alerts/alertSlice"
import textToSearchSlice from "../features/text_to_search/TextToSearchSlice";
import llmSlice from "../features/llms/llmSlice";
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
    documentReducer:documentSlice,
    synonymReducer:synonymSlice,
    categorizationReducer:categorizationSlice,
    semanticReducer:semanticSlice,
    synsetReducer:synsetSlice,
    alertReducer:alertSlice,
    textToSearchReducer: textToSearchSlice,
    llmReducer: llmSlice,

  },
  middleware:(getDefaultMiddleware => getDefaultMiddleware().concat(logger))
});
