import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    selected_tab: 'home',
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
