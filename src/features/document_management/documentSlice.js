import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {get_error} from "../../common/api";

const initialState = {
    document_list: [],
    document_filter: null,
    document_page: 0,
    document_page_size: 10,
    numDocuments:0,
    kb_stats: {},
    document: {},
    show_update_stats: false,

    status: null,
    error: null,
    is_error: false,
    error_text: '',
}

const reducers = {

    clearDocErrorMessage: (state) => {
        state.is_error = false
        state.error_text = ''
    },

}

const extraReducers = (builder) => {
    builder
        .addCase(loadDocumentList.pending, (state) => {
            return {
                ...state,
                busy: true,
                is_error: false,
                error_text: '',
                status: "loading"
            }
        })
        .addCase(loadDocumentList.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                is_error: false,
                error_text: '',
                document_list: action.payload.documentList,
                numDocuments: action.payload.numDocuments,
                status: "fulfilled"
            }
        })
        .addCase(loadDocumentList.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                is_error: true,
                error_text: get_error(action),
                status: "rejected"
            }
        })

        // get document by url
        .addCase(getDocumentByUrl.pending, (state) => {
            return {
                ...state,
                busy: true,
                document: {},
                is_error: false,
                status: "loading"
            }
        })
        .addCase(getDocumentByUrl.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                is_error: false,
                document: action.payload,
                status: "fulfilled"
            }
        })
        .addCase(getDocumentByUrl.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                is_error: true,
                document: {},
                error_text: get_error(action),
                status: "rejected"
            }
        })

}


const documentSlice = createSlice({
    name:"documents",
    initialState,
    reducers,
    extraReducers
})


export const loadDocumentList = createAsyncThunk(
    'documents/getDocuments',
    async ({session_id, organisation_id, kb_id, document_previous, document_page_size, document_filter},
           {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/documents';

        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "filter": document_filter,
            "pageSize": document_page_size?document_page_size: 10,
            "prevUrl": document_previous ? document_previous : 'null',
        }
        return axios.post(url,data,Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return rejectWithValue(error)
                }
            )
    }
);


export const getDocumentByUrl = createAsyncThunk(
    'documents/getDocumentByUrl',
    async ({session_id, organisation_id, kb_id, document_url},
           {rejectWithValue}) => {
        const api_base = window.ENV.api_base;

        const url = api_base + '/document/document'
        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "url": document_url
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return rejectWithValue(error)
                }
            )
    }
);


export default documentSlice.reducer;

export const {
    clearDocErrorMessage,
} = documentSlice.actions

