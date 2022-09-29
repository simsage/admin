import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {loadDocumentList} from "../document_management/documentSlice";

const initialState = {
    synonym_list: [],
    num_synonyms: 0,
    synonym_page_size: 10,
    synonym_page: 0,
    status: null,
    data_status: 'load_now',
    show_synonym_form: false,
    edit:undefined,
}
//organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size
export const loadSynonyms = createAsyncThunk(
    "synonyms/getSynonym",
    async ({session_id, data}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/synonyms';

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
        .addCase(loadSynonyms.pending, (state, action) => {
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(loadSynonyms.fulfilled, (state, action) => {
            console.log("addCase getDocuments fulfilled ", action);
            state.status = "fulfilled";
            state.synonym_list = action.payload.synonymList?action.payload.synonymList:[];
            state.num_synonyms = action.payload.numSynonyms?action.payload.numSynonyms:0;
            state.data_status = 'loaded';
        })
        .addCase(loadSynonyms.rejected, (state, action) => {
            console.log("addCase getDocuments rejected ", action)
            state.status = "rejected";
            state.data_status = 'rejected';
        })
}

const synonymSlice = createSlice({
    name: "synonyms",
    initialState,
    reducers: {
        showAddSynonymForm:(state, action) => {
            state.show_synonym_form = action.payload
        },
        showEditSynonymForm:(state, action) => {
            state.show_synonym_form = action.payload.show;
            state.edit = action.payload.syn;
        },
        closeSynonymForm:(state, action) => {
            state.show_synonym_form = false;
            state.edit = undefined;
        }

    },
    extraReducers
})




export const {showAddSynonymForm, closeSynonymForm, showEditSynonymForm} = synonymSlice.actions;
export default synonymSlice.reducer;