import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db_users from "../../notes/db.json";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";

const initialState = {
    kb_list: [],
    kb_filter: null,
    kb_page: 0,
    kb_page_size: 10,

    status: null,
    error: null,
    show_form: false,
    edit_id: null,
    view_id: null,

    // delete dialog
    show_delete_form: false,
    show_delete_info_form: false,
    delete_data: null,              // {session and kb}
}


export const getKBList = createAsyncThunk(
    'knowledgeBases/getKBList',
    async ({session_id,organization_id}) => {
        const api_base = window.ENV.api_base;
        console.log("organization_id getKBList",organization_id)
        const url = api_base + '/knowledgebase/'+ encodeURIComponent(organization_id);

        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("knowledgeBases11",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("knowledgeBases12",error)
                    return error

                }
            )
    }
);

export const deleteRecord = createAsyncThunk(
    'knowledgeBases/deleteRecord',
    async ({session_id,organisation_id,kb_id})=>{
        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/'+ encodeURIComponent(organisation_id)+ '/' + encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('DELETE ' + api_base + url);
        }

        return axios.delete(url,Comms.getHeaders(session_id))
            .then((response) => {
                console.log("deleteRecord knowledgeBases data",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("deleteRecord knowledgeBases errer",error)
                    return error}
            )
    }
)

export const addOrUpdate = createAsyncThunk(
    'knowledgeBases/addOrUpdate',
    async ({session_id,data})=>{
        console.log("organisations/updateOrganisation");

        const api_base = window.ENV.api_base;
        const url = '/knowledgebase/';
        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url);
        }
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateOrganisation data",response.data)
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
)


const extraReducers = (builder) => {
    builder
        //getKBList
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

        //deleteRecord
        .addCase(deleteRecord.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(deleteRecord.fulfilled, (state, action) => {
            console.log("knowledgeBases/deleteRecord ",action)
            state.status = "fulfilled"
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            state.status = "rejected"
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(addOrUpdate.fulfilled, (state, action) => {
            console.log("knowledgeBases/addOrUpdate ",action)
            state.status = "fulfilled"
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            state.status = "rejected"
        })
}



const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddForm:(state) => {
            state.show_form = true
        },
        showEditForm:(state,action) => {
            state.show_form = true
            state.edit_id = action.payload.kb_id
        },
        showDeleteAskForm:(state, action) => {
            state.show_delete_form = true;
            state.delete_data = action.payload;
        },
        closeDelete:(state) => {
            state.show_delete_form = false;
            state.show_delete_info_form = false;
            state.delete_data = null;
        },
        showDeleteInfo: (state) => {
            state.show_delete_form = false;
            state.show_delete_info_form = true;
        },
        setViewIds:(state,action) => {
            console.log("setViewIds",action.payload)
            state.view_id = action.payload?action.payload:null;
        },
        closeForm:(state) => {
            state.show_form = false;
            state.edit_id = undefined;
        },
        optimizeIndexes:(state, action) => {
            console.log("optimizeIndexes", action.payload)
        },
    },
    extraReducers
});



export const { showAddForm, showEditForm, closeForm, showDeleteAskForm, showDeleteInfo, closeDelete,
               setViewIds, optimizeIndexes} = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;
