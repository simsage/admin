import CategorizationHome from "./CategorizationHome";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    status: null,
    category_list:[],
}
const reducers = {}
const extraReducers = (builder) => {
    builder
        .addCase(loadCategorizations.pending,(state, action) => {
            state.status = "pending"
        })
        .addCase(loadCategorizations.fulfilled,(state, action) => {
            state.status = "fulfilled"
            state.category_list = action.payload
        })
        .addCase(loadCategorizations.rejected,(state, action) => {
            state.status = "rejected"
        })
}

const categorizationSlice = createSlice({
    name:"categorization",
    initialState,
    reducers,
    extraReducers
})

export const loadCategorizations = createAsyncThunk("categorization/loadCategorizations",
    async ({session_id, organisation_id, kb_id}) => {

    console.log("loadCategorizations createAsyncThunk")
        const api_base = window.ENV.api_base;
        const url = api_base + '/language/categorization/' + encodeURIComponent(organisation_id) +'/'+ encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("categorization/loadCategorizations 78", response.data);
                return response.data
            }).catch(
                (error) => {
                    console.log("categorization/loadCategorizations 82", error);
                    return error
                }
            )
    }
);

export const {} = categorizationSlice.actions;
export default categorizationSlice.reducer;

//
// export async function _getCategoryList(organisation_id, kb_id, dispatch, getState) {
//     const session_id = get_session_id(getState)
//     if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
//         dispatch({type: BUSY, busy: true});
//         await Comms.http_get('/language/categorization/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id), session_id,
//             (response) => {
//                 dispatch({type: SET_CATEGORIES, category_list: response.data});
//             },
//             (errStr) => {
//                 dispatch({type: ERROR, title: "Error", error: errStr})
//             }
//         )
//     }
// }
