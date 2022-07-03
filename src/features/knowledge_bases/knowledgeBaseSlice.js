import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db_users from "../../notes/db.json";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";

const initialState = {
    kb_list: db_users.db_kb,
    kb_filter: undefined,
    kb_page: 0,
    kb_page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_kb_form: false,
}

export const getKBList = createAsyncThunk(
    'knowledgeBases/getKBList',
    async ({session,organization_id}) => {
        const api_base = window.ENV.api_base;
        const url = '/knowledgebase/'+ encodeURIComponent(organization_id);

        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(session))
            .then((response) => {
                console.log(response.data)
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);

const extraReducers = (builder) => {
    builder
        .addCase(getKBList.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getKBList.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.kb_list = action.payload
        })
        .addCase(getKBList.rejected, (state, action) => {
            state.status = "rejected"
        })
}



const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddKnowledgeBaseForm:(state,action) => {
            state.show_kb_form = action.payload
        }
    },
    extraReducers
});



export const { showAddKnowledgeBaseForm } = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;