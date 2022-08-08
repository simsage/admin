import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";

const initialState = {
    source_list: undefined,
    source_filter: undefined,
    source_page: 0,
    source_page_size: 10,


    status: '',
    error: '',
    show_form: false,
    edit_id: '',
}

const reducers = {
    showAddForm:(state) => {
        state.show_form = true
    },
    showEditForm:(state,action) => {
        state.show_form = true
        state.edit_id = action.payload.source_id
    },
    closeForm:(state) => {
        console.log("closeForm sourceSlice")
        state.show_form = false;
        state.edit_id = undefined;
    },
}

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
                console.log("sources/getSources",response.data);
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

export const { showAddForm, showEditForm, closeForm  } = sourceSlice.actions
export default sourceSlice.reducer;