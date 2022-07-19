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

    status: undefined,
    error: null,
    show_form: false,
    edit_id: undefined,
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

export const deleteRecord = createAsyncThunk(
    'knowledgeBases/deleteRecord',
    async ({session_id,organisation_id,kb_id})=>{
        const api_base = window.ENV.api_base;
        if (url !== '/stats/stats/os') {
            console.log('DELETE ' + api_base + url);
        }
        const url = api_base + '/knowledgebase/'+ encodeURIComponent(organisation_id)+ '/' + encodeURIComponent(kb_id);

        return axios.delete(url,Comms.getHeaders(session_id))
            .then((response) => {
                console.log("deleteRecord knowledgeBases data",response.data)
                return response.data
            }).catch(
                (error) => {return error}
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




//     updateKnowledgeBase: (organisation_id, kb_id, name, email, security_id, enabled, max_queries_per_day,
//                           analytics_window_size_in_months, operator_enabled, capacity_warnings,
//                           created, dms_index_schedule, enable_similarity, similarity_threshold) => async (dispatch, getState) => {
//     dispatch({type: BUSY, busy: true});
//     const payload = {"kbId": kb_id, "organisationId": organisation_id, "name": name, "email": email,
//         "securityId": security_id, "maxQueriesPerDay": max_queries_per_day, "enabled": enabled,
//         "analyticsWindowInMonths": analytics_window_size_in_months, "operatorEnabled": operator_enabled,
//         "capacityWarnings": capacity_warnings, "created": created, "dmsIndexSchedule": dms_index_schedule,
//         "enableDocumentSimilarity": enable_similarity, "documentSimilarityThreshold": similarity_threshold};
//     await Comms.http_put('/knowledgebase/', get_session_id(getState), payload,
//         () => {
//             _getKnowledgeBases(organisation_id, dispatch, getState);
//         },
//         (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
//     )
// },


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
        closeForm:(state) => {
            state.show_form = false;
            state.edit_id = undefined;
        },
    },
    extraReducers
});



export const { showAddForm, showEditForm, closeForm} = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;