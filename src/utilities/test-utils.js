import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
// As a basic setup, import your same slice reducers
import authReducer from "../features/auth/authSlice";
import homeReducer from '../features/home/homeSlice'
import usersReducer from "../features/users/usersSlice";
import knowledgeBaseReducer from "../features/knowledge_bases/knowledgeBaseSlice";
import organisationReducer from "../features/organisations/organisationSlice";
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
import alertSlice from "../features/alerts/alertSlice"
import textToSearchSlice from "../features/text_to_search/TextToSearchSlice";
export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = configureStore({ reducer: {
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
                alertReducer:alertSlice,
                textToSearchReducer: textToSearchSlice,
            },
            preloadedState }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}