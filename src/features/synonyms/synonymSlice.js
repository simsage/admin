import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    synonym_list: [],
    num_synonyms: 0,
    synonym_page_size: 10,
    synonym_page: 0,
    status: null,
    data_status: 'load_now',
    show_synonym_form: false,
    edit:undefined,
    show_delete_form: false,
    filter: "",
}
//organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size
export const loadSynonyms = createAsyncThunk(
    "synonyms/getSynonym",
    async ({session_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/synonyms`;

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })

export const updateSynonyms = createAsyncThunk(
    "synonyms/updateSynonym",
    async ({session_id, organisation_id, knowledge_base_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/save-synonym/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}`;

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteSynonym = createAsyncThunk(
            "synonyms/deleteSynonym",
                async ({session_id, organisation_id, knowledge_base_id , id}, {rejectWithValue}) => {

                const api_base = window.ENV.api_base;
                const url = api_base + `/language/delete-synonym/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}/${encodeURIComponent(id)}`

                return axios.delete(url,Comms.getHeaders(session_id))
                    .then((response) => {
                        return response.data
                    }).catch((err) => {
                        return rejectWithValue(err?.response?.data)
                    })
                }
)

const extraReducers = (builder) => {
    builder
        .addCase(loadSynonyms.pending, (state) => {
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(loadSynonyms.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.synonym_list = action.payload.synonymList?action.payload.synonymList:[];
            state.num_synonyms = action.payload.numSynonyms?action.payload.numSynonyms:0;
            state.data_status = 'loaded';
        })
        .addCase(loadSynonyms.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Synonym Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

    // update synonym
        .addCase(updateSynonyms.pending, (state) => {
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(updateSynonyms.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
            state.show_synonym_form = false;
            state.edit = undefined;
        })
        .addCase(updateSynonyms.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Synonym Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //delete Synonym
        .addCase(deleteSynonym.pending, (state) => {
            state.status = "loading"
        })

        .addCase(deleteSynonym.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(deleteSynonym.rejected, (state, action) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Synonym Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
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
        closeSynonymForm:(state) => {
            state.show_synonym_form = false;
            state.edit = undefined;
        },
        showDeleteSynonymForm:(state, action) => {
            state.show_delete_form = action.payload.show
            state.edit = action.payload.synonym
        },
        closeDeleteForm:(state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
        // filterSearch:(state,action) => {
        //     state.data_status = 'load_now';
        //     state.filter = action.payload;
        // }

    },
    extraReducers
})




export const {closeErrorMessage,showAddSynonymForm, closeSynonymForm, showEditSynonymForm, showDeleteSynonymForm, closeDeleteForm } = synonymSlice.actions;
export default synonymSlice.reducer;