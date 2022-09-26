import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

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

    //delete
    show_delete_form:false,

    //add default
    show_add_default_form:false,

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
        state.show_delete_form = false;
        state.show_add_default_form = false;
    },

    showDeleteAskForm:(state, action) => {
        state.show_delete_form = true;
        state.selected_synset = action.payload.selected_synset;
    },

    showAddDefaultAskForm:(state, action) => {
        state.show_add_default_form = true;
    },

};

const extraReducers = (builder) => {
    builder
        .addCase(loadSynsets.pending, (state, action) => {
            state.status = "pending"
            state.data_status = 'loading';
        })
        .addCase(loadSynsets.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.synset_list = action.payload.list?action.payload.list:[]
            state.synset_total_size = action.payload.totalSize?action.payload.totalSize:0
            state.data_status = 'loaded';
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


        //addDefaultSynsets
        .addCase(addDefaultSynsets.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(addDefaultSynsets.fulfilled, (state, action) => {
            console.log("synsets/addDefaultSynsets ",action)
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(addDefaultSynsets.rejected, (state, action) => {
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


///api/language/save-syn-set/{organisationId}/{kbId}
export const addOrUpdate = createAsyncThunk(
    "synsets/addOrUpdate",
    async ({organisation_id, kb_id, session_id, data}) => {
        console.log("synsets/addOrUpdate");

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        console.log('PUT ' + url);

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("response",response.data)
                return response.data
            }).catch(
                (error) => {return error}
            )
})


///api/language/delete-syn-set/{organisationId}/{kbId}/{lemma}
export const deleteRecord = createAsyncThunk(
    "synsets/deleteRecord",
    async ({organisation_id, kb_id, session_id, lemma}) => {
        console.log("synsets/deleteSynSet");

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/delete-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id)+ '/' + encodeURIComponent(lemma);
        console.log('PUT ' + url);

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    })


// /api/language/default-syn-sets/{organisationId}/{kbId}
export const addDefaultSynsets = createAsyncThunk(
    "synsets/addDefaultSynsets",
    async ({organisation_id, kb_id, session_id, data}) => {
        console.log("synsets/addDefaultSynsets");

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/default-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        console.log('PUT ' + url);

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("response",response.data)
                return response.data
            }).catch(
                (error) => {return error}
            )
    })


export const {showAddForm, showEditForm, closeForm, showDeleteAskForm, showAddDefaultAskForm} = synsetSlice.actions;
export default synsetSlice.reducer;


