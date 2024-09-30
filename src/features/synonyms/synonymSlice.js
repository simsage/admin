import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    synonym_list: [],
    num_synonyms: 0,
    synonyms_busy: false,
    synonym_page_size: 10,
    synonym_page: 0,
    status: null,
    data_status: 'load_now',
    show_synonym_form: false,
    edit: undefined,
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
            return {
                ...state,
                status: "loading",
                synonyms_busy: true,
                data_status: 'loading'
            }
        })

        .addCase(loadSynonyms.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                synonyms_busy: false,
                synonym_list: action.payload.synonymList?action.payload.synonymList:[],
                num_synonyms: action.payload.numSynonyms?action.payload.numSynonyms:0,
                data_status: 'loaded'
            }
        })
        .addCase(loadSynonyms.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                synonyms_busy: false,
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Synonym Load Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        // update synonym
        .addCase(updateSynonyms.pending, (state) => {
            return {
                ...state,
                status:  "loading",
                synonyms_busy: true,
                data_status: 'loading'
            }
        })

        .addCase(updateSynonyms.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                synonyms_busy: false,
                data_status: 'load_now',
                show_synonym_form: false,
                edit: undefined
            }
        })
        .addCase(updateSynonyms.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                synonyms_busy: false,
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Synonym Update Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
        //delete Synonym
        .addCase(deleteSynonym.pending, (state) => {
            return {
                ...state,
                synonyms_busy: true,
                status: "loading"
            }
        })
        .addCase(deleteSynonym.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                synonyms_busy: false,
                data_status: 'load_now'
            }
        })
        .addCase(deleteSynonym.rejected, (state, action) => {
            return {
                status: "rejected",
                synonyms_busy: false,
                show_error_form: true,
                error_title: "Synonym Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}

const synonymSlice = createSlice({
    name: "synonyms",
    initialState,
    reducers: {
        showAddSynonymForm:(state, action) => {
            return {
                ...state,
                show_synonym_form: action.payload
            }
        },
        showEditSynonymForm:(state, action) => {
            return {
                ...state,
                show_synonym_form: action.payload.show,
                edit: action.payload.syn
            }
        },
        closeSynonymForm:(state) => {
            return {
                show_synonym_form: false,
                edit: undefined
            }
        },
        showDeleteSynonymForm:(state, action) => {
            return {
                show_delete_form: action.payload.show,
                edit: action.payload.synonym
            }
        },
        closeDeleteForm:(state) => {
            return {
                ...state,
                show_delete_form: false,
                edit: undefined
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
    },
    extraReducers
})


export const {
    closeErrorMessage,
    showAddSynonymForm,
    closeSynonymForm,
    showEditSynonymForm,
    showDeleteSynonymForm,
    closeDeleteForm
} = synonymSlice.actions;

export default synonymSlice.reducer;