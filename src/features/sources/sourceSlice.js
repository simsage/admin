import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";
import {updateOrganisation} from "../organisations/organisationSlice";

const initialState = {
    source_list: {},
    source_filter: null,
    source_page: 0,
    source_page_size: 10,

    status: null,
    error: '',

    show_form: false,
    edit_id: null,
    selected_source: {}
}

const reducers = {
    showAddForm:(state) => {
        state.show_form = true
        state.edit_id = null
        state.selected_source = {}
    },
    showEditForm:(state,action) => {
        state.show_form = true
        state.edit_id = action.payload.source_id
        state.selected_source = action.payload.source
    },
    closeForm:(state) => {
        console.log("closeForm sourceSlice")
        state.show_form = false;
        state.edit_id = null;
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

        .addCase(updateSources.fulfilled, (state, action) => {
            console.log("updateSources fulfilled ",action)
            state.show_form = false;
            state.edit_id = null;
            state.selected_source = {};
        })
        .addCase(updateSources.rejected, (state, action) => {
            console.log("updateSources rejected ", action)
        })
}


export const getSources = createAsyncThunk(
    'sources/getSources',
    async ({session_id, organisation_id, kb_id}) => {
        const api_base = window.ENV.api_base;
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

export const updateSources = createAsyncThunk(
    'sources/updateSources',
    async ({session_id,data}) => {

        console.log("sources/updateSources");

        const api_base = window.ENV.api_base;
        const url = '/crawler/crawler/';

        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url);
        }
        return axios.post(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateSources data",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error",error)
                    return error
                }
            )

});

// updateCrawler: (crawler) => async (dispatch, getState) => {
//     dispatch({type: BUSY, busy: true});
//     const organisation_id = getState().appReducer.selected_organisation_id;
//     const kb_id = getState().appReducer.selected_knowledgebase_id;
//     const session_id = get_session_id(getState);
//     await Comms.http_post('/crawler/crawler', session_id, crawler,
//         () => {
//             _getCrawlers(organisation_id, kb_id, dispatch, getState)
//         },
//         (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
//     )
// },


const sourceSlice = createSlice({
    name: 'sources',
    initialState,
    reducers,
    extraReducers
});

export const { showAddForm, showEditForm, closeForm  } = sourceSlice.actions
export default sourceSlice.reducer;