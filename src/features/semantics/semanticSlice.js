import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState ={
    semantic_list: [],
    status:null,
    num_semantics:0,
    semantic_page_size:10,
    semantic_page:0,
    data_status: 'load_now',
    show_semantic_form: false,
    edit: undefined,
    show_delete_form : false,
    prev_word:0
}
//organisation_id,kb_id,prev_word,filter,page_size
export const loadSemantics = createAsyncThunk("semantics/getSemantic",
    async ({session_id, data})=>{

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/semantics';

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    })

export const updateSemantics = createAsyncThunk(
    "semantics/updateSemantics",

        async ({session_id, organisation_id, knowledge_base_id, data}) => {

            const api_base = window.ENV.api_base;
            const url = api_base + `/language/save-semantic/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}`;

            return axios.put(url, data, Comms.getHeaders(session_id))
                .then((response) => {
                    return response.data
                }).catch(
                    (error) => {return error}
                )
        }
)

export const deleteSemantic = createAsyncThunk(
    "semantic/deleteSemantic",

        async ({session_id, organisation_id, knowledge_base_id, word}) => {

            const api_base = window.ENV.api_base;
            const url = api_base + `/language/delete-semantic/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}/${encodeURIComponent(word)}`

            return axios.delete(url, Comms.getHeaders(session_id))
                .then( (response) => {
                    return response.data
                }).catch(
                    (error) => {return error}
                )
            }
)

const extraReducers = (builder) => {
    builder
        .addCase(loadSemantics.pending, (state, action) => {
            state.status = "loading";
            state.data_status = "loading";
        })

        .addCase(loadSemantics.fulfilled, (state, action) => {
            console.log("loadSemantics fulfilled ", action);
            state.status = "fulfilled";
            state.semantic_list = action.payload.semanticList?action.payload.semanticList:[];
            state.num_semantics = action.payload.numSemantics?action.payload.numSemantics:0;
            state.data_status = "loaded";
        })
        .addCase(loadSemantics.rejected, (state, action) => {
            console.log("loadSemantics rejected ", action)
            state.status = "rejected"
            state.data_status = "rejected";
        })

        //update semantics
        .addCase(updateSemantics.pending, (state, action) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(updateSemantics.fulfilled, (state, action) => {
            console.log("loadSemantics fulfilled ", action);
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(updateSemantics.rejected, (state, action) => {
            console.log("loadSemantics rejected ", action)
            state.status = "rejected"
            state.data_status = "rejected";
        })
        //delete semantic
        .addCase(deleteSemantic.pending, (state, action) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(deleteSemantic.fulfilled, (state, action) => {
            console.log("loadSemantics fulfilled ", action);
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(deleteSemantic.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected";
        })
}

const semanticSlice = createSlice({
    name:"semantics",
    initialState,
    reducers: {
        showEditSemanticForm:(state, action) => {
            state.show_semantic_form = action.payload.show;
            state.edit = action.payload.semantic
        },
        showAddSemanticForm:(state, action) => {
            state.show_semantic_form = action.payload;
        },
        closeSemanticForm:(state, action) => {
            state.show_semantic_form = false;
            state.edit = undefined;
        },
        showDeleteSemanticAsk:(state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit = action.payload.semantic;
        },
        closeDeleteForm:(state, action) => {
            state.show_delete_form = false;
            state.edit = undefined;
        }
    },
    extraReducers
})


export const {showEditSemanticForm, closeSemanticForm, showAddSemanticForm, showDeleteSemanticAsk, closeDeleteForm} = semanticSlice.actions;
export default semanticSlice.reducer;