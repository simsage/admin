import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState ={
    semantic_list: [
        {
            "word": "Aaran",
            "semantic": "person"
        },
        {
            "word": "Aaron",
            "semantic": "person"
        },
        {
            "word": "Aarons",
            "semantic": "person"
        },
        {
            "word": "Aasen",
            "semantic": "person"
        },
        {
            "word": "Abad",
            "semantic": "person"
        },
        {
            "word": "Abadie",
            "semantic": "person"
        },
        {
            "word": "Abarca",
            "semantic": "person"
        },
        {
            "word": "Abas",
            "semantic": "person"
        },
        {
            "word": "Abbas",
            "semantic": "person"
        },
        {
            "word": "Abbate",
            "semantic": "person"
        }
    ],
    status:null,
    num_semantics:0,
    semantic_page_size:10,
    semantic_page:0,
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(getSemantic.pending,(state, action)=>{
            state.status = action.payload
        })
}

const semanticSlice = createSlice({
    name:"semantics",
    initialState,
    reducers,
    extraReducers
})


const getSemantic = createAsyncThunk("semantics/getSemantic",async ()=>{

})

export const {} = semanticSlice.actions;
export default semanticSlice.reducer;