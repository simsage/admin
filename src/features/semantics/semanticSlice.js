import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loadSynonyms} from "../synonyms/synonymSlice";
import axios from "axios";
import Comms from "../../common/comms";

const initialState ={
    semantic_list: [],
    // semantic_list: [
    //     {
    //         "word": "Aaran",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Aaron",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Aarons",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Aasen",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abad",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abadie",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abarca",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abas",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abbas",
    //         "semantic": "person"
    //     },
    //     {
    //         "word": "Abbate",
    //         "semantic": "person"
    //     }
    // ],
    status:null,
    num_semantics:0,
    semantic_page_size:10,
    semantic_page:0,
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(loadSemantics.pending, (state, action) => {
            state.status = "loading"
        })

        .addCase(loadSemantics.fulfilled, (state, action) => {
            console.log("loadSemantics fulfilled ", action);
            state.status = "fulfilled";
            state.semantic_list = action.payload.semanticList?action.payload.semanticList:[];
            state.num_semantics = action.payload.numSemantics?action.payload.numSemantics:0;
        })
        .addCase(loadSemantics.rejected, (state, action) => {
            console.log("loadSemantics rejected ", action)
            state.status = "rejected"
        })
}

const semanticSlice = createSlice({
    name:"semantics",
    initialState,
    reducers,
    extraReducers
})


export const loadSemantics = createAsyncThunk("semantics/getSemantic",
    async ({session_id,organisation_id,kb_id,prev_word,filter,page_size})=>{

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/semantics';
        // return "Hello";language/synonyms
        if (url !== '/stats/stats/os') {
            console.log('put ' + url);
        }

        const data = {
            "organisationId": organisation_id,
            "kbId": kb_id,
            "prevWord": prev_word ? prev_word : 1,
            "filter": filter ? filter : "",
            "pageSize": page_size ? page_size : 10
        };

        console.log("loadSemantics data",data)
        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("loadSemantics responsedata", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("loadSemantics error", error)
                    return error

                }
            )

    })

export const {} = semanticSlice.actions;
export default semanticSlice.reducer;