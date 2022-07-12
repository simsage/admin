import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";
import {useSelector} from "react-redux";

const initialState = {
    organisation_filter: undefined,
    organisation_list: undefined,
    organisation_page: 0,
    organisation_page_size: 10,

    //new states
    status: undefined,
    error: undefined,
    show_organisation_form: false,
    edit_organisation_id: undefined,
}

const reducers = {
    showAddOrganisationForm:(state,action) => {
        state.show_organisation_form = action.payload.show_form;
    },

    showEditOrganisationForm:(state,action) => {

        state.show_organisation_form = action.payload.show_form;
        state.edit_organisation_id = action.payload.org_id;
    },

    closeOrganisationForm:(state) => {
    state.show_organisation_form = false;
    state.edit_organisation_id = undefined;
    },

}

const extraReducers = (builder) => {
    builder
        .addCase(getOrganisationList.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getOrganisationList.fulfilled, (state, action) => {
            console.log("addCase simSageSignIn fulfilled ",action);
            state.status = "fulfilled";
            state.organisation_list = []; //action.payload;
            console.log('action.payload', action.payload);
        })
        .addCase(getOrganisationList.rejected, (state, action) => {
            console.log("addCase simSageSignIn rejected ",action)
            state.status = "rejected"
        })
        .addCase(updateOrganisation.fulfilled, (state, action) => {
            console.log("addCase updateOrganisation fulfilled ",action)
            state.show_organisation_form = false;
            state.edit_organisation_id = undefined;
            // state.organisation_list = action.payload
        })
        .addCase(updateOrganisation.rejected, (state, action) => {
        console.log("addCase updateOrganisation rejected ",action)
    })
}


export const getOrganisationList = createAsyncThunk(
    'organisations/getOrganisationList',
    async ({session,filter}) => {
        console.log("organisations/getOrganisationList");
        const api_base = window.ENV.api_base;
        const url = '/auth/user/organisations/'+ encodeURIComponent(filter);
        const { id } = session

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
        );


export const updateOrganisation = createAsyncThunk(
    'organisations/updateOrganisation',
    async ({session_id,data})=>{
        console.log("organisations/updateOrganisation");

        const api_base = window.ENV.api_base;
        const url = '/auth/organisation/';
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


// function getOrganisationList(current_org_name, current_org_id, _filter, change_organisation, dispatch, getState, session_id) {
//     dispatch({type: BUSY, busy: true});
//     session_id = session_id ? session_id : get_session_id(getState)
//     let filter = _filter;
//     if (!_filter || _filter.trim() === "") {
//         filter = "null";
//     }
//     await Comms.http_get('/auth/user/organisations/' + encodeURIComponent(filter), session_id,
//         (response) => {
//             const organisation_list = response.data;
//             dispatch({type: SET_ORGANISATION_LIST, organisation_list: organisation_list});
//             // select an organisation if there is one to select and none yet has been selected
//             if (change_organisation && organisation_list && organisation_list.length > 0 && current_org_id.length === 0) {
//                 dispatch({type: SELECT_ORGANISATION, name: organisation_list[0].name, id: organisation_list[0].id});
//                 // todo::and get the knowledge bases for this org
//                 // _getKnowledgeBases(organisation_list[0].id, dispatch, getState);
//             }
//         },
//         (errStr) => {
//             dispatch({type: ERROR, title: "Error", error: errStr})
//         }
//     )
// }



const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers,
    extraReducers
});

export const {showAddOrganisationForm, showEditOrganisationForm, closeOrganisationForm } = organisationSlice.actions
export default organisationSlice.reducer;