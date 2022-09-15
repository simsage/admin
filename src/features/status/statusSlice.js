import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getOrganisationList} from "../organisations/organisationSlice";
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
            .addCase(getSimSageStatus.pending, (state, action) => {
                state.status = "loading"
            })

            .addCase(getSimSageStatus.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.status_list = action.payload;
                // console.log('action.payload', action.payload);
            })
            .addCase(getSimSageStatus.rejected, (state, action) => {
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
        const url = api_base + '/stats/status/'+ encodeURIComponent(organisation_id);;

        if (url !== '/stats/stats/os') {
            console.log('put ' + url);
        }

        return axios.put(url,{},Comms.getHeaders(session_id))
            .then((response) => {
                console.log("status/getSimSageStatus 1", response.data);
                return response.data
            }).catch(
                (error) => {
                    console.log("status/getSimSageStatus", error);
                    return error
                }
            )
    }
);


export const {} = statusSlice.actions
export default statusSlice.reducer;