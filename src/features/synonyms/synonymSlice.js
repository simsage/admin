import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {loadDocumentList} from "../document_management/documentSlice";

const initialState = {
    synonym_list: [
        {
            "id": "1",
            "words": "GLP,Global Legal Post,legal posts"
        },
        {
            "id": "2",
            "words": "cc,Clifford Chance"
        },
        {
            "id": "3",
            "words": "job,role,candidate,position,assistant"
        },
        {
            "id": "4",
            "words": "ip,intellectual property"
        },
        {
            "id": "5",
            "words": "german,germany,berlin,munich"
        },
        {
            "id": "6",
            "words": "fieldfisher,field fisher"
        },
        {
            "id": "7",
            "words": "russia,moscow"
        }
    ],
    num_synonyms: 0,
    synonym_page_size: 10,
    synonym_page: 0,
    status: null
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(loadDocumentList.pending, (state, action) => {
            state.status = "loading"
        })

        .addCase(loadDocumentList.fulfilled, (state, action) => {
            console.log("addCase getDocuments fulfilled ", action);
            state.status = "fulfilled";
            state.synonym_list = action.payload.synonymList;
            state.num_synonyms = action.payload.numSynonyms;
        })
        .addCase(loadDocumentList.rejected, (state, action) => {
            console.log("addCase getDocuments rejected ", action)
            state.status = "rejected"
        })
}

const synonymSlice = createSlice({
    name: "synonyms",
    initialState,
    reducers,
    extraReducers
})
const getSynonym = createAsyncThunk("synonyms/getSynonym",
    async ({session_id, organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/synonyms';
        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "prevId": prev_id ? prev_id : 1,
            "filter": synonym_filter ? synonym_filter : null,
            "pageSize": synonym_page_size ? synonym_page_size : 10
        };

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("getSynonym data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("getSynonym error", error)
                    return error

                }
            )

    })

export const {} = synonymSlice.actions;
export default synonymSlice.reducer;


// export async function _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch, getState) {
//     const session_id = get_session_id(getState)
//     if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
//         dispatch({type: BUSY, busy: true});
//         const data = {
//             "organisationId": organisation_id, "kbId": kb_id, "prevId": prev_id ? prev_id : "",
//             "filter": synonym_filter, "pageSize": synonym_page_size
//         };
//         await Comms.http_put('/language/synonyms', session_id, data,
//             (response) => {
//                 dispatch({type: SET_SYNONYMS_PAGINATED, data: response.data});
//             },
//             (errStr) => {
//                 dispatch({type: ERROR, title: "Error", error: errStr})
//             }
//         )
//     }
// }