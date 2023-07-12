import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    synset_total_size: 0,
    synset_page_size: 10,
    synset_page: 0,
    synset_list: [],
    status: false,
    show_synset_form: false,

    //add selected_synset data
    error: null,
    show_error_form: false,

    show_data_form: false,
    selected_synset: null,
    data_status: 'load_now',//load_now,loading,loaded

    //delete
    show_delete_form: false,

    //add default
    show_add_default_form: false,

    //filter
    allow_no_results: false,

};


export const loadSynsets = createAsyncThunk("synsets/loadSynsets",
    async ({session_id, organisation_id, kb_id, page, filter, page_size}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/find-syn-sets';
        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "page": page ? page : 0,
            "filter": filter ? filter : "",
            "pageSize": page_size ? page_size : 10
        };
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


///api/language/save-syn-set/{organisationId}/{kbId}
export const addOrUpdate = createAsyncThunk(
    "synsets/addOrUpdate",
    async ({organisation_id, kb_id, session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


///api/language/delete-syn-set/{organisationId}/{kbId}/{lemma}
export const deleteRecord = createAsyncThunk(
    "synsets/deleteRecord",
    async ({organisation_id, kb_id, session_id, lemma}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/delete-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(lemma);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


// /api/language/default-syn-sets/{organisationId}/{kbId}
export const addDefaultSynsets = createAsyncThunk(
    "synsets/addDefaultSynsets",
    async ({organisation_id, kb_id, session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/default-syn-sets/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


const extraReducers = (builder) => {
    builder
        .addCase(loadSynsets.pending, (state) => {
            state.status = "pending"
            state.data_status = 'loading';
        })
        .addCase(loadSynsets.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.synset_list = action.payload && action.payload.list ? action.payload.list : []
            state.synset_total_size = action.payload && action.payload.totalSize ? action.payload.totalSize : 0
            state.data_status = 'loaded';
        })
        .addCase(loadSynsets.rejected, (state, action) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "SynSet Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            state.status = "loading"
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Test Query Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state) => {
            state.status = "loading"
        })
        .addCase(addOrUpdate.fulfilled, (state) => {
                state.status = "fulfilled";
                state.data_status = 'load_now';
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "SynSet update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        //addDefaultSynsets
        .addCase(addDefaultSynsets.pending, (state) => {
            state.status = "loading"
        })
        .addCase(addDefaultSynsets.fulfilled, (state) => {
                state.status = "fulfilled"
                state.data_status = 'load_now';
        })
        .addCase(addDefaultSynsets.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'loaded';
            state.show_error_form = true
            state.error_title = "SynSet Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


};

const synsetSlice = createSlice({
    name: "synsets",
    initialState,
    reducers: {
        showAddSynSetForm: (state) => {
            state.show_synset_form = true
        },

        showEditSynSetForm: (state, action) => {
            state.show_synset_form = true
            state.selected_synset = action.payload.selected_synset
        },

        closeSynSetForm: (state) => {
            state.show_synset_form = false;
            state.selected_synset = null;
        },

        showDeleteSynSetForm: (state, action) => {
            state.show_delete_form = true;
            state.selected_synset = action.payload.selected_synset;
        },

        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.selected_synset = undefined;
        },

        showAddDefaultAskForm: (state) => {
            state.show_add_default_form = true;
        },

        closeDefaultAskForm: (state) => {
            state.show_add_default_form = false;
        },
        noResultsMessage: (state, action) => {
            state.allow_no_results = action.payload;
        },

        closeForm: (state) => {
            state.show_synset_form = false;
            state.show_delete_form = false;
            state.show_add_default_form = false;
        },
        closeErrorMessage: (state) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },

    },
    extraReducers
});

export const {
    closeErrorMessage,
    showAddSynSetForm,
    showEditSynSetForm,
    showDeleteSynSetForm,
    closeDeleteForm,
    showAddDefaultAskForm,
    closeDefaultAskForm,
    noResultsMessage,
    closeForm
} = synsetSlice.actions;
export default synsetSlice.reducer;


