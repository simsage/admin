import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    synset_total_size: 0,
    synset_page_size: 10,
    synset_page: 0,
    synset_list: [],
    status: false,
    language_busy: false,
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
            return {
                ...state,
                status: "pending",
                language_busy: true,
                data_status: 'loading'
            }
        })
        .addCase(loadSynsets.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                language_busy: false,
                data_status: 'loaded',
                synset_list: action.payload && action.payload.list ? action.payload.list : [],
                synset_total_size: action.payload && action.payload.totalSize ? action.payload.totalSize : 0
            }
        })
        .addCase(loadSynsets.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                language_busy: false,
                show_error_form: true,
                error_title: "SynSet Load Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            return {
                ...state,
                status: "loading",
                language_busy: true,
            }
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                language_busy: false,
                data_status: 'load_now'
            }
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                language_busy: false,
                show_error_form: true,
                error_title: "Test Query Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state) => {
            return {
                ...state,
                status: "loading",
                language_busy: true,
            }
        })
        .addCase(addOrUpdate.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                language_busy: false,
                data_status: 'load_now'
            }
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                language_busy: false,
                show_error_form: true,
                error_title: "SynSet update Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })


        //addDefaultSynsets
        .addCase(addDefaultSynsets.pending, (state) => {
            return {
                ...state,
                status: "loading",
                language_busy: true,
            }
        })
        .addCase(addDefaultSynsets.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                language_busy: false,
                data_status: 'load_now'
            }
        })
        .addCase(addDefaultSynsets.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                language_busy: false,
                show_error_form: true,
                data_status: 'loaded',
                error_title: "SynSet Delete Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
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
            state.selected_synset = undefined;
        },
        closeErrorMessage: (state) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
            state.selected_synset = undefined;
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


