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
    async ({session_id, organisation_id, kb_id, page, filter, page_size}) => {
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
            }).catch(
                (error) => {
                    return error
                }
            )
    })


///api/language/save-syn-set/{organisationId}/{kbId}
export const addOrUpdate = createAsyncThunk(
    "synsets/addOrUpdate",
    async ({organisation_id, kb_id, session_id, data}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    })


///api/language/delete-syn-set/{organisationId}/{kbId}/{lemma}
export const deleteRecord = createAsyncThunk(
    "synsets/deleteRecord",
    async ({organisation_id, kb_id, session_id, lemma}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/delete-syn-set/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(lemma);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    })


// /api/language/default-syn-sets/{organisationId}/{kbId}
export const addDefaultSynsets = createAsyncThunk(
    "synsets/addDefaultSynsets",
    async ({organisation_id, kb_id, session_id, data}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/default-syn-sets/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    })


const extraReducers = (builder) => {
    builder
        .addCase(loadSynsets.pending, (state, action) => {
            state.status = "pending"
            state.data_status = 'loading';
        })
        .addCase(loadSynsets.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.synset_list = action.payload.list ? action.payload.list : []
            state.synset_total_size = action.payload.totalSize ? action.payload.totalSize : 0
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
            if (action && action.payload && action.payload.code === "ERR_BAD_RESPONSE") {
                state.error = action.payload.response.data.error;
                state.status = "rejected";
                state.show_error_form = true;
            } else {
                state.status = "fulfilled";
                state.data_status = 'load_now';
            }
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            state.status = "rejected"
        })


        //addDefaultSynsets
        .addCase(addDefaultSynsets.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(addDefaultSynsets.fulfilled, (state, action) => {

            if (action && action.payload && (action.payload.code === "ERR_BAD_RESPONSE" || action.payload.code === "ERR_BAD_REQUEST")) {
                state.error = action.payload.response.data.error;
                state.status = "rejected"
                state.show_error_form = true;
            } else {
                state.status = "fulfilled"
                state.data_status = 'load_now';
            }
        })
        .addCase(addDefaultSynsets.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'loaded';
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

        showAddDefaultAskForm: (state, action) => {
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
            state.show_error_form = false;
            state.selected_synset = undefined;
        }

    },
    extraReducers
});

export const {
    showAddSynSetForm,
    showEditSynSetForm,
    closeSynSetForm,
    showDeleteSynSetForm,
    closeDeleteForm,
    showAddDefaultAskForm,
    closeDefaultAskForm,
    noResultsMessage,
    closeForm
} = synsetSlice.actions;
export default synsetSlice.reducer;


