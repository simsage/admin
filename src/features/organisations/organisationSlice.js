import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";
import {useSelector} from "react-redux";
import {deleteRecord} from "../knowledge_bases/knowledgeBaseSlice";

const initialState = {
    organisation_filter: null,
    organisation_list: {},
    organisation_page: 0,
    organisation_page_size: 10,

    status: null,
    error: null,
    show_organisation_form: false,
    edit_organisation_id: null,
    data_status: 'load_now',//load_now,loading,loaded
}

const reducers = {
    showAddOrganisationForm: (state, action) => {
        state.show_organisation_form = action.payload.show_form;
    },

    showEditOrganisationForm: (state, action) => {
        state.show_organisation_form = action.payload.show_form;
        state.edit_organisation_id = action.payload.org_id;
    },

    closeOrganisationForm: (state) => {
        state.show_organisation_form = false;
        state.edit_organisation_id = null;
    },

    setOrganisationList:(state,action) => {
        state.organisation_list = action.payload.organisationList
        state.status = "fulfilled";
    }

}

const extraReducers = (builder) => {
    builder
        .addCase(getOrganisationList.pending, (state, action) => {
            state.status = "loading"
            state.data_status = 'loading';
        })

        .addCase(getOrganisationList.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.organisation_list = action.payload;
            state.data_status = 'loaded';
            // console.log('action.payload', action.payload);
        })
        .addCase(getOrganisationList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
        })

        //update Organisation
        .addCase(updateOrganisation.fulfilled, (state, action) => {
            state.show_organisation_form = false;
            state.edit_organisation_id = undefined;
            state.data_status = 'load_now';
            // state.organisation_list = action.payload
        })
        .addCase(updateOrganisation.rejected, (state, action) => {
            console.log("addCase updateOrganisation rejected ", action)
        })

        //delete Record
        .addCase(deleteRecord.fulfilled, (state, action) => {
            state.status = "fulfilled"
        })

}


export const getOrganisationList = createAsyncThunk(
    'organisations/getOrganisationList',
    async ({session, filter}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/user/organisations/' + encodeURIComponent(filter);
        const {id} = session

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);


// /api/auth/organisation/
export const updateOrganisation = createAsyncThunk(
    'organisations/updateOrganisation',
    async ({session_id, data}) => {
        console.log("organisations/updateOrganisation");

        const api_base = window.ENV.api_base;
        const url = '/auth/organisation/';
        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url);
        }
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateOrganisation data", response.data)
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
)


// /api/auth/organisation/{organisationId}
export const deleteOrganisation = createAsyncThunk(
    'organisations/deleteOrganisation',
    async ({session_id,organisation_id})=>{
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/organisation/'+ encodeURIComponent(organisation_id);

        if (url !== '/stats/stats/os') {
            console.log('DELETE ' + api_base + url);
        }

        return axios.delete(url,Comms.getHeaders(session_id))
            .then((response) => {
                console.log("deleteOrganisation",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("deleteOrganisation error",error)
                    return error}
            )
    }
)



const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers,
    extraReducers
});

export const {showAddOrganisationForm, showEditOrganisationForm, closeOrganisationForm, setOrganisationList} = organisationSlice.actions
export default organisationSlice.reducer;