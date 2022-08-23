import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState ={
    synonym_list:[
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
    num_synonyms:0,
    synonym_page_size:10,
    synonym_page:0,
    status:null
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(getSynonym.pending,(state, action)=>{
            state.status = action.payload
        })
}

const synonymSlice = createSlice({
    name:"synonyms",
    initialState,
    reducers,
    extraReducers
})


const getSynonym = createAsyncThunk("synonyms/getSynonym",async ()=>{

})

export const {} = synonymSlice.actions;
export default synonymSlice.reducer;