import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db_users from "../../notes/db.json";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";

const initialState = {
    kb_list: undefined,
    kb_filter: undefined,
    kb_page: 0,
    kb_page_size: 10,

    //new states
    status: undefined,
    error: null,
    show_kb_form: false,
}

export const getKBList = createAsyncThunk(
    'knowledgeBases/getKBList',
    async ({session,organization_id}) => {
        const api_base = window.ENV.api_base;
        console.log("organization_id",organization_id)
        const url = api_base + '/knowledgebase/'+ encodeURIComponent(organization_id);

        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session))
            .then((response) => {
                console.log("knowledgeBases11",response.data)
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
            console.log("knowledgeBases/getKBList ",action)
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