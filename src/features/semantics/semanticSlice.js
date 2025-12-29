import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {uri_esc} from "../../common/api";

const initialState ={
    semantic_list: [],
    semantics_busy: false,
    status: null,
    num_semantics: 0,
    semantic_page_size: 10,
    semantic_page: 0,
    data_status: 'load_now',
    show_semantic_form: false,
    edit: undefined,
    show_delete_form : false,
    show_import: false,
    prev_word:0,
    error: null,
}

const extraReducers = (builder) => {
    builder
        .addCase(loadSemantics.pending, (state) => {
            state.status = "loading";
            state.semantics_busy = true;
            state.data_status = "loading";
        })

        .addCase(loadSemantics.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.semantics_busy = false;
            state.semantic_list = action.payload.semanticList?action.payload.semanticList:[];
            state.num_semantics = action.payload.numSemantics?action.payload.numSemantics:0;
            state.data_status = "loaded";
        })
        .addCase(loadSemantics.rejected, (state, action) => {
            state.status = "rejected"
            state.semantics_busy = false;
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "Semantic Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //update semantics
        .addCase(updateSemantics.pending, (state) => {
            state.status = "loading";
            state.semantics_busy = true;
            state.data_status = "loading";
        })
        .addCase(updateSemantics.fulfilled, (state) => {
            state.status = "fulfilled";
            state.semantics_busy = false;
            state.data_status = "load_now";
        })
        .addCase(updateSemantics.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected";
            state.semantics_busy = false;
            state.show_error_form = true
            state.error_title = "Semantic Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //delete semantic
        .addCase(deleteSemantic.pending, (state) => {
            state.status = "loading";
            state.semantics_busy = true;
            state.data_status = "loading";
        })
        .addCase(deleteSemantic.fulfilled, (state) => {
            state.status = "fulfilled";
            state.semantics_busy = false;
            state.data_status = "load_now";

        })
        .addCase(deleteSemantic.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected";
            state.semantics_busy = false;
            state.show_error_form = true
            state.error_title = "Semantic Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        // import Semantics
        .addCase(importSemantics.pending, (state) => {
            return {
                ...state,
                semantics_busy: true,
                status: "loading"
            }
        })
        .addCase(importSemantics.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                semantics_busy: false,
                show_import: false,
                data_status: 'load_now'
            }
        })
        .addCase(importSemantics.rejected, (state, action) => {
            return {
                status: "rejected",
                semantics_busy: false,
                show_import: true,
                show_error_form: true,
                error_title: "Semantics Import Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })


}

const semanticSlice = createSlice({
    name:"semantics",
    initialState,
    reducers: {
        showEditSemanticForm:(state, action) => {
            state.show_semantic_form = true;
            state.edit = action.payload.semantic
        },
        showAddSemanticForm:(state, action) => {
            state.show_semantic_form = action.payload.show === true;
            state.edit = {word: "", semantic: ""}
        },
        closeSemanticForm:(state) => {
            state.show_semantic_form = false;
            state.edit = undefined;
        },
        showDeleteSemanticAsk:(state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit = action.payload.semantic;
        },
        closeDeleteForm:(state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        closeForm:(state) => {
            state.show_semantic_form = false;
            state.show_delete_form = false;
            state.error = false;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
        showImportSemanticsForm:(state, action) => {
            return {
                ...state,
                show_import: true
            }
        },
        closeImportSemanticsForm:(state) => {
            return {
                ...state,
                show_import: false
            }
        },
    },
    extraReducers
})


export const {closeErrorMessage,
    closeForm,
    showEditSemanticForm,
    closeSemanticForm,
    showAddSemanticForm,
    showDeleteSemanticAsk,
    closeDeleteForm,
    showImportSemanticsForm,
    closeImportSemanticsForm
} = semanticSlice.actions;


//organisation_id,kb_id,prev_word,filter,page_size
export const loadSemantics = createAsyncThunk("semantics/getSemantic",
    async ({session_id, data}, {rejectWithValue})=>{

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/semantics';

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })

export const updateSemantics = createAsyncThunk(
    "semantics/updateSemantics",

    async ({session_id, organisation_id, knowledge_base_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/save-semantic/${uri_esc(organisation_id)}/${uri_esc(knowledge_base_id)}`;

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteSemantic = createAsyncThunk(
    "semantic/deleteSemantic",

    async ({session_id, organisation_id, knowledge_base_id, word, semantic}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/delete-semantic/${uri_esc(organisation_id)}/${uri_esc(knowledge_base_id)}/${uri_esc(word)}/${uri_esc(semantic)}`

        return axios.delete(url, Comms.getHeaders(session_id))
            .then( (response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const importSemantics = createAsyncThunk(
    "synonyms/importSemantics",
    async ({
               session_id,
               organisation_id,
               kb_id,
               text
           }, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + "/language/upload-semantics"

        const data = {
            organisationId: organisation_id,
            kbId: kb_id,
            text: text
        }

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export default semanticSlice.reducer;