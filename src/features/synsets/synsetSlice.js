import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    synset_total_size:0,
    synset_page_size:10,
    synset_page:0,
    synset_list:[],
    status:false,
};

const reducers = {};

const extraReducers = (builder) => {
    builder.addCase(getSynsets.pending,(state, action)=>{
        state.status = action.payload
    })
};

const synsetSlice = createSlice({
    name: "synsets",
    initialState,
    reducers,
    extraReducers
});


export const getSynsets = createAsyncThunk("synsets/getSynsets",
    async () => {
            return true;
    })


export const {} = synsetSlice.actions;
export default synsetSlice.reducer;


