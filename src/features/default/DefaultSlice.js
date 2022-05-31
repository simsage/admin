import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    // session and user objects
    // session: null,
    // user: null,
    // selected_organisation: null,
    selected_tab: 'overview',
    // selected_knowledge_base: null,

};

export const defaultSlice = createSlice({
    name: 'defaultApp',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        selectTab: (state, action) => {
            state.selected_tab = action.payload;
        },

        closeAllMenus(){

        }
    },
});

export const { selectTab } = defaultSlice.actions;

export default defaultSlice.reducer;
