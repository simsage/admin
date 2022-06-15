import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    session: null,
    selected_tab: 'overview',
    selected_organisation: null,
    selected_knowledge_base: null,
    selected_edge_device: null,
    theme: window.ENV.theme,
    license: null,          // system license
    uploading: false,       // program busy uploading
    busy: false,            // system busy
    error_title: "Error",   // application error messages
    error: "",
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

export const { selectTab, closeAllMenus } = defaultSlice.actions;

export default defaultSlice.reducer;
