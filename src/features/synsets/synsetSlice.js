import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {deleteRecord} from "../knowledge_bases/knowledgeBaseSlice";

const initialState = {
    synset_total_size: 0,
    synset_page_size: 10,
    synset_page: 0,
    synset_list: [],
    status: false,

    //add edit data
    error: null,
    show_data_form: false,
    selected_synset: null,
    data_status: 'load_now',//load_now,loading,loaded


};

const reducers = {
    showAddForm:(state) => {
        state.show_data_form = true
    },

    showEditForm:(state,action) => {
        state.show_data_form = true
        state.selected_synset = action.payload.selected_synset
    },

    closeForm:(state) => {
        state.show_data_form = false;
        state.selected_synset = null;
    },

};

const extraReducers = (builder) => {
    builder
        .addCase(loadSynsets.pending, (state, action) => {
            state.status = "pending"
        })
        .addCase(loadSynsets.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.synset_list = action.payload.list?action.payload.list:[]
            state.synset_total_size = action.payload.totalSize?action.payload.totalSize:0
        })
        .addCase(loadSynsets.rejected, (state, action) => {
            state.status = "rejected"
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(deleteRecord.fulfilled, (state, action) => {
            console.log("synsets/deleteRecord ",action)
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            state.status = "rejected"
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(addOrUpdate.fulfilled, (state, action) => {
            console.log("synsets/addOrUpdate ",action)
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            state.status = "rejected"
        })


};

const synsetSlice = createSlice({
    name: "synsets",
    initialState,
    reducers,
    extraReducers
});

//
export const loadSynsets = createAsyncThunk("synsets/loadSynsets",
    async ({session_id, organisation_id, kb_id, page, filter, page_size}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/find-syn-sets';

        if (url !== '/stats/stats/os') {
            console.log('put ' + url);
        }

        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "page": page ? page : 0,
            "filter": filter ? filter : "",
            "pageSize": page_size ? page_size : 10
        };

        console.log("loadSynsets data",data)
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("load Synsets response data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("loadSynsets error", error)
                    return error

                }
            )
    })


export const addOrUpdate = createAsyncThunk(
    "synsets/updateSynset",
    async ({organisation_id, kb_id, session_id, data}) => {
        console.log("synsets/updateSynset");

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        console.log('PUT ' + url);

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                // thunkAPI.dispatch(updateKB(response.data));
                return response.data
            }).catch(
                (error) => {return error}
            )
})


export const deleteSynSet = createAsyncThunk(
    "synsets/deleteSynSet",
    async ({organisation_id, kb_id, session_id, lemma}) => {
        console.log("synsets/deleteSynSet");

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id)+ '/' + encodeURIComponent(lemma);
        console.log('PUT ' + url);

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                // thunkAPI.dispatch(updateKB(response.data));
                return response.data
            }).catch(
                (error) => {return error}
            )
    })


export const {showAddForm, showEditForm, closeForm, } = synsetSlice.actions;
export default synsetSlice.reducer;


