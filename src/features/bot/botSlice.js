import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {}

const reducers = {}

const extraReducers = (builder) => {
    builder
        .addCase()
}

const botSlice = createSlice({
    name:"bot",
    initialState,
    reducers,
    extraReducers
})


export const get = createAsyncThunk(
    "bot/get",
    async ({}) => {

    }
)



