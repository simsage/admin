import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";

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

//
// const extraReducers = (builder) => {
//     builder
//         .addCase()
//
// }


const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers,
});



export const { showAddOrganisationForm } = organisationSlice.actions
export default organisationSlice.reducer;