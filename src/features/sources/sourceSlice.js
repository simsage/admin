import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";

const initialState = {
    source_list: undefined,
    status: undefined,
    error: undefined,
}

const reducers = {}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getSources.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.source_list = action.payload
        })
        .addCase(getSources.rejected, (state, action) => {
            state.status = "rejected"
        })
}


export const getSources = createAsyncThunk(
    'sources/getSources',
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


const sourceSlice = createSlice({
    name: 'sources',
    initialState,
    reducers,
    extraReducers
});

export const {  } = sourceSlice.actions
export default sourceSlice.reducer;