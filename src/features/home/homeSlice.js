import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getSources} from "../sources/sourceSlice";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    selected_tab: 'home',
    status_list:undefined,
    theme: null,
    license: undefined,          // system license
    uploading: undefined,       // program busy uploading
    busy: undefined,            // system busy
    error_title: "Error",   // application error messages
    error: "",
};







export const getStatus = createAsyncThunk(
    'home/getStatus',
    async ({session_id, organisation_id, kb_id}) => {
        console.log("sources/getSources");
        const api_base = window.ENV.api_base;
        // http://localhost:8080/api/crawler/crawlers/c276f883-e0c8-43ae-9119-df8b7df9c574/46ff0c75-7938-492c-ab50-442496f5de51

        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);


const extraReducers = (builder) => {
    builder
        .addCase(getStatus.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getStatus.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.source_list = action.payload
        })
        .addCase(getStatus.rejected, (state, action) => {
            state.status = "rejected"
        })
}



export const homeSlice = createSlice({
    name: 'home',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        selectTab: (state, action) => {
            state.selected_tab = action.payload;
        },

        closeAllMenus(){

        }
    },
    extraReducers
});

export const { selectTab, closeAllMenus } = homeSlice.actions;

export default homeSlice.reducer;
