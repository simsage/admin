import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {get_error} from "../../common/api";

const empty_llm = {
    llm: 'none',
    key: '',
    model: '',
    documentQATokens: 1000,
    summaryTokens: 1000,
    numSearchResults: 5,
    perSearchResultTokens: 100
}

const initialState = {
    is_error: false,
    error_text: '',
    status: '',
    busy: false,
    llm_model: empty_llm,
}


export const loadLLM = createAsyncThunk(
    "llm/loadLLM",

    async ({session_id, organisation_id, kb_id, on_success}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/llm/${encodeURIComponent(organisation_id)}/${encodeURIComponent(kb_id)}`;

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


const extraReducers = (builder) => {
    builder
        .addCase(updateLLM.pending, (state) => {
            return {...state, busy: true, is_error: false, status: "loading"};
        })
        .addCase(updateLLM.fulfilled, (state, action) => {
            return {...state, busy: false, status: "fulfilled", llm_model: action.payload.llm};
        })
        .addCase(updateLLM.rejected, (state, action) => {
            return {...state,
                busy: false,
                status: "rejected",
                is_error: true,
                error_text: get_error(action)
            }
        })

        ////////////////////////////////////////////////////////////////////////////

        .addCase(loadLLM.pending, (state) => {
            return {...state, busy: true, is_error: false, status: "loading"};
        })
        .addCase(loadLLM.fulfilled, (state, action) => {
            return {...state,
                busy: false,
                status: "fulfilled",
                llm_model: action.payload ?
                action.payload : empty_llm
            }
        })
        .addCase(loadLLM.rejected, (state, action) => {
            return {...state,
                busy: false,
                status: "rejected",
                is_error: true,
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
    },
    extraReducers
})

export const {
    showErrorMessage,
    closeErrorMessage
} = llmSlice.actions;

export default llmSlice.reducer;
