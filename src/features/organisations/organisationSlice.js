import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";
import {useSelector} from "react-redux";
import {deleteRecord} from "../knowledge_bases/knowledgeBaseSlice";

const initialState = {
    organisation_original_list: [],
    organisation_filter: null,
    organisation_list: [],
    organisation_page: 0,
    organisation_page_size: 10,

    status: null,
    error: null,
    show_organisation_form: false,
    edit_organisation_id: null,
    data_status: 'load_now',//load_now,loading,loaded

    //for backups
    organisation_original_backup_list: [],
    organisation_backup_filter: null,
    organisation_backup_list: [{"backupId":1675160719696,"organisationId":"0185bfd5-676e-3acd-1259-077838a55188","name":"MaxTest2","data":""},{"backupId":1675160666126,"organisationId":"c276f883-e0c8-43ae-9119-df8b7df9c574","name":"SimSage","data":""},{"backupId":1675157688590,"organisationId":"c276f883-e0c8-43ae-9119-df8b7df9c574","name":"SimSage","data":""},{"backupId":1675154527361,"organisationId":"0185bfcb-3a35-2583-5ae2-718d6f197db6","name":"MaxTest","data":""},{"backupId":1675154557931,"organisationId":"0185bfd5-676e-3acd-1259-077838a55188","name":"MaxTest2","data":""}],
    organisation_backup_page: 0,
    organisation_backup_page_size: 10,

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
        state.organisation_original_list = action.payload.organisationList
        state.status = "fulfilled";
    },

    //
    search: (state, action) => {

        if (action.payload.keyword.length > 0) {
            let temp = state.organisation_original_list.filter(list_item => {
                return list_item.name.match(new RegExp(action.payload.keyword, "i"))
            });
            if (temp.length > 0) {
                state.organisation_list = temp
                state.status = "fulfilled";
            } else {
                // dispatchEvent(ErrorAlert({title:"Search",message:"No matching record found"}))
                state.organisation_list = state.organisation_original_list;
                state.status = "fulfilled";
            }
        } else {
            state.organisation_list = state.organisation_original_list;
            state.status = "fulfilled";
        }
    },

    orderBy: (state, action) => {

        switch (action.payload.order_by) {
            default:
            case 'alphabetical':
                state.organisation_list = state.organisation_original_list.sort((a, b) => (a.name > b.name) ? 1 : -1);
                state.status = "fulfilled";
                break;
            case 'recently_added':
                state.organisation_list = state.organisation_original_list.sort((a, b) => (a.created > b.created) ? 1 : -1);
                state.status = "fulfilled";
                break
        }
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
            state.organisation_original_list = action.payload;
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
        .addCase(deleteOrganisation.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })

        //backup
        .addCase(getOrganisationBackupList.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.organisation_backup_list = action.payload;
            state.organisation_original_backup_list = action.payload;
            // console.log('action.payload', action.payload);
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




//Organisation Backups


//https://adminux.simsage.ai/api/backup/backups/c276f883-e0c8-43ae-9119-df8b7df9c574
export const getOrganisationBackupList = createAsyncThunk(
    'organisations/getOrganisationBackupListc',
    async ({session, organisation_id}) => {
        const api_base = window.ENV.api_base;
        const url = '/backup/backups/' + encodeURIComponent(organisation_id);
        const {id} = session

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(id))
            .then((response) => {
                console.log("getOrganisationBackupList",response.data)
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);

// /api/auth/organisation/{organisationId}
// https://adminux.simsage.ai/api/backup/backup/{organisationId}/specific
export const backupOrganisation = createAsyncThunk(
    'organisations/backupOrganisation',
    async ({session_id,organisation_id})=>{
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/backup/'+ encodeURIComponent(organisation_id)+'/specific';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + api_base + url);
        }
        const data = {};
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("backupOrganisation",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("backupOrganisation error",error)
                    return error}
            )
    }
)


// /api/auth/organisation/{organisationId}
// https://adminux.simsage.ai/api/backup/backup/{organisationId}/specific
export const restoreOrganisation = createAsyncThunk(
    'organisations/backupOrganisation',
    async ({session_id,data})=>{
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/restore/';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + api_base + url);
        }
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("backupOrganisation",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("backupOrganisation error",error)
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

export const {showAddOrganisationForm, showEditOrganisationForm, closeOrganisationForm, setOrganisationList, search, orderBy} = organisationSlice.actions
export default organisationSlice.reducer;