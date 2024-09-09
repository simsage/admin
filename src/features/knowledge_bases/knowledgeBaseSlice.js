import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {get_error} from "../../common/api";

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

    // error handling
    is_error: false,
    error_text: '',

    //security ID
    show_securityID_prompt: false,
    scheduleEnable: false
}


const extraReducers = (builder) => {
    builder
        //getKBList
        .addCase(getKBList.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                is_error: false,
                error_text: '',
            }
        })
        .addCase(getKBList.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                is_error: false,
                error_text: '',
                kb_list: action.payload,
                kb_original_list: action.payload,
            }
        })
        .addCase(getKBList.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                is_error: true,
                error_text: get_error(action),
                error_title: "KnowledgeBase Load Failed"
            }
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading"
            }
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: 'load_now'
            }
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                show_error_form: true,
                error_title: "KnowledgeBase Delete Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //addOrUpdate
        .addCase(addOrUpdate.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading"
            }
        })
        .addCase(addOrUpdate.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: 'load_now',
                show_form: false,
                edit_id: undefined
            }
        })
        .addCase(addOrUpdate.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                show_error_form: true,
                error_title: "KnowledgeBase Update Failed",
                error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}


const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddForm: (state) => {
            return {
                ...state,
                show_form: true,
            }
        },
        showEditForm: (state, action) => {
            return {
                ...state,
                show_form: true,
                edit_id: action.payload.kb_id
            }
        },
        showDeleteAskForm: (state, action) => {
            return {
                ...state,
                show_delete_form: true,
                delete_data: action.payload
            }
        },
        closeDelete: (state) => {
            return {
                ...state,
                show_delete_form: false,
                show_delete_info_form: false,
                delete_data: null
            }
        },
        showDeleteInfo: (state) => {
            return {
                ...state,
                show_delete_form: false,
                show_delete_info_form: true
            }
        },
        setViewIds: (state, action) => {
            return {
                ...state,
                view_id: action.payload ? action.payload : null,
            }
        },
        closeForm: (state) => {
            return {
                ...state,
                show_form: false,
                edit_id: undefined,
            }
        },
        showOptimizeAskDialog: (state, action) => {
            state.optimize_data = {...action.payload, "action": "optimize"};
            state.show_optimize_form = true;
        },
        showOptimizeAbortDialog: (state, action) => {
            return {
                ...state,
                show_optimize_form: true,
                optimize_data: {...action.payload, "action": "abort"},
            }
        },
        closeOptimize: (state) => {
            return {
                ...state,
                show_optimize_form: false,
                optimize_data: null,
            }
        },
        closeTruncateIndexes: (state) => {
            return {
                ...state,
                show_truncate_indexes_form: false,
                truncate_indexes_data: null,
            }
        },
        closeErrorMessage: (state, _) => {
            return {
                ...state,
                show_error_form: false,
                error_message: undefined,
                error_title: undefined
            }
        },
        showSecurityPrompt: (state) => {
            return {
                ...state,
                show_securityID_prompt: true
            }
        },
        closeSecurityPrompt:(state) => {
            return {...state, show_securityID_prompt: false}
        },
        //
        search: (state, action) => {

            if (action.payload.keyword.length > 0) {
                const regex = new RegExp(action.payload.keyword, "i")
                let temp = state.kb_original_list.filter(kb_list_item => {
                    return kb_list_item.name.match(regex) || kb_list_item.kbId === action.payload.keyword
                });
                if (temp.length > 0) {
                    return {...state,
                        kb_list: temp,
                        status: "fulfilled"
                    }
                } else {
                    return {...state,
                        kb_list: [],
                        status: "fulfilled"
                    }
                }
            } else {
                return {...state,
                    kb_list: state.kb_original_list,
                    status: "fulfilled"
                }
            }
        },
    },
    extraReducers
})


export const getKBList = createAsyncThunk(
    'knowledgeBases/getKBList',
    async ({session_id, organization_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/' + encodeURIComponent(organization_id);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((error) => {
                return rejectWithValue(error)
            })
    }
)

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
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const optimizeIndexesAbort = createAsyncThunk(
    'knowledgeBases/optimizeIndexesAbort',

    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const data = {"organisationId": organisation_id, "kbId": kb_id}
        const api_base = window.ENV.api_base;
        const url = '/language/optimize-indexes-abort';
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
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
    showSecurityPrompt,
    closeSecurityPrompt,
    closeErrorMessage,
    showAddForm,
    showEditForm,
    closeForm,
    showDeleteAskForm,
    showDeleteInfo,
    closeDelete,
    setViewIds,
    showOptimizeAskDialog,
    showOptimizeAbortDialog,
    closeOptimize,
    search,
    closeTruncateIndexes
} = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;
