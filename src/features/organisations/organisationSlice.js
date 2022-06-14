import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../utilities/comms";

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


const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers: {
        showAddOrganisationForm:(state,action) => {
            state.show_knowledge_base_form = action.payload
        }
    }
});




// export async function _getOrganisationList(current_org_name, current_org_id, _filter, change_organisation, dispatch, getState, session_id) {
export async function getOrganisationList() {

    dispatch({type: BUSY, busy: true});
    session_id = session_id ? session_id : (getState)
    let filter = _filter;
    if (!_filter || _filter.trim() === "") {
        filter = "null";
    }
    await Comms.http_get('/auth/user/organisations/' + encodeURIComponent(filter), session_id,
        (response) => {
            const organisation_list = response.data;
            console.log(organisation_list)
            // dispatch({type: SET_ORGANISATION_LIST, organisation_list: organisation_list});
            // // select an organisation if there is one to select and none yet has been selected
            // if (change_organisation && organisation_list && organisation_list.length > 0 && current_org_id.length === 0) {
            //     dispatch({type: SELECT_ORGANISATION, name: organisation_list[0].name, id: organisation_list[0].id});
            //     // and get the knowledge bases for this org
            //     _getKnowledgeBases(organisation_list[0].id, dispatch, getState);
            // }
        },
        (errStr) => {
            dispatch({type: ERROR, title: "Error", error: errStr})
        }
    )
}



export const { showAddOrganisationForm } = organisationSlice.actions
export default organisationSlice.reducer;