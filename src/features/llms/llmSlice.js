import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {get_error, uri_esc} from "../../common/api";

export const empty_llm = {
    llm: 'none',
    id: 0,
    key: '',
    model: '',
    documentQATokens: 1000,
    summaryTokens: 1000,
    numSearchResults: 1,
    endpoint: "",
    tokensThisMonth: 0,
    tokensPerMonthMax: 1000000,
    perSearchResultTokens: 100,
    enabled: true,
    useForInference: true,
    useForTraining: true,
}

const initialState = {
    is_error: false,
    error_text: '',
    status: '',
    busy: false,
    llm_list: [],
    llm_edit: undefined,
    needs_reload: false
}


export const loadLLMList = createAsyncThunk(
    "llm/loadLLMList",

    async ({session_id, organisation_id, kb_id, page, page_size, on_success}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/llm/${uri_esc(organisation_id)}/${uri_esc(kb_id)}/${page}/${page_size}`;

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const updateLLM = createAsyncThunk(
    "llm/updateLLM",

    async ({session_id, llm_data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/llm`;

        return axios.put(url, llm_data, Comms.getHeaders(session_id))
            .then((response) => {
                response.data.llm = llm_data;
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const deleteLLM = createAsyncThunk(
    "llm/deleteLLM",

    async ({session_id, organisation_id, kb_id, id}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/llm/${uri_esc(organisation_id)}/${uri_esc(kb_id)}/${id}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


const extraReducers = (builder) => {
    builder
        .addCase(updateLLM.pending, (state) => {
            return {...state, busy: true, is_error: false, status: "loading"};
        })
        .addCase(updateLLM.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                llm_edit: undefined,
                needs_reload: true
            };
        })
        .addCase(updateLLM.rejected, (state, action) => {
            return {...state,
                busy: false,
                status: "rejected",
                is_error: true,
                needs_reload: false,
                error_text: get_error(action)
            }
        })

        ////////////////////////////////////////////////////////////////////////////

        .addCase(loadLLMList.pending, (state) => {
            return {...state, busy: true, is_error: false, status: "loading"};
        })
        .addCase(loadLLMList.fulfilled, (state, action) => {
            return {...state,
                busy: false,
                status: "fulfilled",
                llm_list: action.payload ? action.payload : empty_llm,
                needs_reload: false
            }
        })
        .addCase(loadLLMList.rejected, (state, action) => {
            return {...state,
                busy: false,
                status: "rejected",
                is_error: true,
                needs_reload: false,
                error_text: get_error(action)
            }
        })

        ////////////////////////////////////////////////////////////////////////////

        .addCase(deleteLLM.pending, (state) => {
            return {...state, busy: true, is_error: false, status: "loading"};
        })
        .addCase(deleteLLM.fulfilled, (state, action) => {
            return {...state,
                busy: false,
                status: "fulfilled",
                needs_reload: true
            }
        })
        .addCase(deleteLLM.rejected, (state, action) => {
            return {...state,
                busy: false,
                status: "rejected",
                is_error: true,
                needs_reload: false,
                error_text: get_error(action)
            }
        })
}

const llmSlice = createSlice({
    name: "llm",
    initialState,
    reducers: {
        showErrorMessage: (state, action) => {
            return {
                ...state,
                is_error: true,
                error_text: action.payload.error_message,
            }
        },
        closeErrorMessage: (state, _) => {
            return {
                ...state,
                is_error: false,
                error_text: undefined
            }
        },

        newLLM: (state) => {
            return {
                ...state,
                is_error: false,
                error_text: undefined,
                llm_edit: empty_llm
            }
        },

        editLLM: (state, action) => {
            return {
                ...state,
                is_error: false,
                error_text: undefined,
                llm_edit: action.payload.llm_edit
            }
        },

        closeLLMEdit: (state, _) => {
            return {
                ...state,
                is_error: false,
                error_text: undefined,
                llm_edit: undefined
            }
        },

    },
    extraReducers
})

export const {
    showErrorMessage,
    closeErrorMessage,
    newLLM,
    closeLLMEdit,
    editLLM
} = llmSlice.actions;

export default llmSlice.reducer;
