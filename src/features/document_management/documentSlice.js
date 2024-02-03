import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    document_list: [],
    document_filter: null,
    document_page: 0,
    document_page_size: 10,
    numDocuments:0,

    status: null,
    error: null,
}

const reducers = {

}

const extraReducers = (builder) => {
    builder
        .addCase(loadDocumentList.pending, (state) => {
            state.status = "loading"
        })

        .addCase(loadDocumentList.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.document_list = action.payload.documentList;
            state.numDocuments = action.payload.numDocuments;
        })
        .addCase(loadDocumentList.rejected, (state) => {
            state.status = "rejected"
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
    async ({session_id, organisation_id, kb_id, document_previous, document_page_size, document_filter}) => {
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
                    return error
                }
            )
    }
);


// export const {} = documentSlice.actions;
export default documentSlice.reducer;


//
// export async function _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch, getState) {
//     const session_id = get_session_id(getState)
//     if (organisation_id.length > 0 && kb_id.length > 0) {
//         dispatch({type: BUSY, busy: true});
//         await Comms.http_post('/document/documents', session_id, {
//                 "organisationId": organisation_id, "kbId": kb_id,
//                 "prevUrl": document_previous ? document_previous : 'null',
//                 "pageSize": document_page_size,
//                 "filter": document_filter
//             },
//             (response) => {
//                 const document_list = response.data.documentList;
//                 const num_documents = response.data.numDocuments;
//                 dispatch(({
//                     type: GET_DOCUMENTS_PAGINATED,
//                     document_list: document_list,
//                     num_documents: num_documents,
//                     document_filter: document_filter
//                 }));
//             },
//             (errStr) => {
//                 dispatch({type: ERROR, title: "Error", error: errStr})
//             }
//         )
//     }
// }