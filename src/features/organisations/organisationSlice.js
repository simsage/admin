import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../utilities/comms";
import {acquireTokenSilent} from "../auth/authSlice";

const initialState = {
    organisation_filter: "",
    organisation_list: [],
    organisation_page: 0,
    organisation_page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_organisation_form: false,
}

const reducers = {
    showAddOrganisationForm:(state,action) => {
        state.show_organisation_form = action.payload
    }
}


const extraReducers = (builder) => {
    builder
        .addCase(acquireTokenSilent.pending,(state) => {
            state.status = 'loading...'
        })
        .addCase(acquireTokenSilent.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.jwt = action.payload
            console.log("fulfilled",action)
        })
        .addCase(acquireTokenSilent.rejected, (state) => {
            state.status = 'rejected'
        })

}


const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers,
    extraReducers
});



export const { showAddOrganisationForm } = organisationSlice.actions
export default organisationSlice.reducer;