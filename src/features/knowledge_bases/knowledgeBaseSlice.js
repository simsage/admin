import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
// import ErrorAlert from "../alerts/ErrorAlert";

const initialState = {
    kb_original_list: [],
    kb_list: [],
    kb_filter: null,
    kb_page: 0,
    kb_page_size: 10,
    busy: false,

    status: null,
    error: null,
    show_form: false,
    edit_id: null,
    view_id: null,
    data_status: 'load_now',//load_now,loading,loaded

    // delete dialog
    show_delete_form: false,
    show_delete_info_form: false,
    delete_data: null,              // {session and kb}

    // ask optimize
    show_optimize_form: false,
    optimize_data: null,            // {session and kb}

    // ask truncate indexes
    show_truncate_indexes_form: false,
    truncate_indexes_data: null,    // {session and kb}

    //security ID
    show_securityID_prompt: false
}


const extraReducers = (builder) => {
    builder
        //getKBList
        .addCase(getKBList.pending, (state) => {
            state.busy = true;
            state.status = "loading";
            state.data_status = 'loading';
        })
        .addCase(getKBList.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled";
            state.kb_list = action.payload;
            state.kb_original_list = action.payload;
            state.data_status = 'loaded';
        })
        .addCase(getKBList.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "KnowledgeBase Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            state.busy = true;
            state.status = "loading"
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            state.busy = false;
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "KnowledgeBase Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state) => {
            state.busy = true;
            state.status = "loading"
        })
        .addCase(addOrUpdate.fulfilled, (state) => {
            state.busy = false;
            state.status = "fulfilled"
            state.data_status = 'load_now';
            state.show_form = false;
            state.edit_id = undefined;
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "KnowledgeBase Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}


const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddForm: (state) => {
            state.show_form = true
        },
        showEditForm: (state, action) => {
            state.show_form = true
            state.edit_id = action.payload.kb_id
        },
        showDeleteAskForm: (state, action) => {
            state.show_delete_form = true;
            state.delete_data = action.payload;
        },
        closeDelete: (state) => {
            state.show_delete_form = false;
            state.show_delete_info_form = false;
            state.delete_data = null;
        },
        showDeleteInfo: (state) => {
            state.show_delete_form = false;
            state.show_delete_info_form = true;
        },
        setViewIds: (state, action) => {
            state.view_id = action.payload ? action.payload : null;
        },
        closeForm: (state) => {
            state.show_form = false;
            state.edit_id = undefined;
        },
        showOptimizeAskDialog: (state, action) => {
            state.optimize_data = action.payload;
            state.show_optimize_form = true;
        },
        closeOptimize: (state) => {
            state.show_optimize_form = false;
            state.optimize_data = null;
        },
        showTruncateIndexesAskDialog: (state, action) => {
            state.truncate_indexes_data = action.payload;
            state.show_truncate_indexes_form = true;
        },
        closeTruncateIndexes: (state) => {
            state.show_truncate_indexes_form = false;
            state.truncate_indexes_data = null;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
        showSecurityPrompt: (state) => {
            return {
                ...state,
                show_securityID_prompt: true
            }
        },
        closeSecurityPrompt:(state) => {
            return{...state, show_securityID_prompt: false}
        },
        //
        search: (state, action) => {

            if (action.payload.keyword.length > 0) {
                let temp = state.kb_original_list.filter(kb_list_item => {
                    return kb_list_item.name.match(new RegExp(action.payload.keyword, "i"))
                });
                if (temp.length > 0) {
                    state.kb_list = temp
                    state.status = "fulfilled";
                } else {
                    // dispatchEvent(ErrorAlert({title:"Search",message:"No matching record found"}))
                    state.kb_list = state.kb_original_list;
                    state.status = "fulfilled";
                }
            } else {
                state.kb_list = state.kb_original_list;
                state.status = "fulfilled";
            }
        },

        orderBy: (state, action) => {

            switch (action.payload.order_by) {
                default:
                case 'alphabetical':
                    state.kb_list = state.kb_original_list.sort((a, b) => (a.name > b.name) ? 1 : -1);
                    state.status = "fulfilled";
                    break;
                case 'recently_added':
                    state.kb_list = state.kb_original_list.sort((a, b) => (a.created > b.created) ? 1 : -1);
                    state.status = "fulfilled";
                    break
            }
        }


    },
    extraReducers
});


export const getKBList = createAsyncThunk(
    'knowledgeBases/getKBList',
    async ({session_id, organization_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/' + encodeURIComponent(organization_id);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);

export const deleteRecord = createAsyncThunk(
    'knowledgeBases/deleteRecord',
    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const addOrUpdate = createAsyncThunk(
    'knowledgeBases/addOrUpdate',

    async ({session_id, data},{rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/save';
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                // thunkAPI.dispatch(updateKB(response.data));
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const optimizeIndexes = createAsyncThunk(
    'knowledgeBases/optimizeIndexes',

    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const data = {"organisationId": organisation_id, "kbId": kb_id}
        const api_base = window.ENV.api_base;
        const url = '/language/optimize-indexes';
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                // thunkAPI.dispatch(updateKB(response.data));
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const truncateSlowIndexes = createAsyncThunk(
    'knowledgeBases/truncateSlowIndexes',

    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = '/language/truncate-slow-indexes/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const {

    showSecurityPrompt, closeSecurityPrompt, closeErrorMessage,showAddForm, showEditForm, closeForm, showDeleteAskForm, showDeleteInfo, closeDelete,
    setViewIds, showOptimizeAskDialog, closeOptimize, updateKB, search, orderBy,

    showTruncateIndexesAskDialog, closeTruncateIndexes
} = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;
