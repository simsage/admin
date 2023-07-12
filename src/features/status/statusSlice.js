import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    status_list: [],
    status: null,
    error: null,
}

const reducers = {}

const extraReducers = (builder) => {
        builder
            .addCase(getSimSageStatus.pending, (state) => {
                state.status = "loading"
            })

            .addCase(getSimSageStatus.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.status_list = action.payload;
            })
            .addCase(getSimSageStatus.rejected, (state) => {
                state.status = "rejected"
            })
}

const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers,
    extraReducers
});

//curl -X PUT -d '{}' -H 'session-id:0182c552-a1e9-8002-b544-a15464c490ec' -H 'api-version:1' -H 'content-type: application/json'
// https://uat-cloud.simsage.ai/api/stats/status/018210f0-a3c2-86ae-0a30-f293d2d099a4
export const getSimSageStatus = createAsyncThunk(
    'status/getSimSageStatus',
    async ({session_id, organisation_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/stats/status/'+ encodeURIComponent(organisation_id);
        return axios.put(url,{},Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);


export default statusSlice.reducer;
