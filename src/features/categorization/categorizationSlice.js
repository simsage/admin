import CategorizationHome from "./CategorizationHome";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    status: null,
    category_list:[],
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(getCategorizations.pending,(state, action) => {
            state.status = action.payload
        })
}

const categorizationSlice = createSlice({
    name:"categorization",
    initialState,
    reducers,
    extraReducers
})

export const getCategorizations = createAsyncThunk("categorization/getCategorizations",
    async () => {
        return true;
    }
    )

export const {} = categorizationSlice.actions;
export default categorizationSlice.reducer;
