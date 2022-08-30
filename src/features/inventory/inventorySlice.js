import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";
import {getSimSageStatus} from "../status/statusSlice";

const initialState = {
    inventory_list: [],
    inventor_busy: false,
    status: null,
    error: null,
    show_form: false,
    edit_id: null,
    view_id: null,
    selected_inventory:{}
};

const reducers = {
    showAddForm(state) {
        state.show_form = true
    },

    showEditForm(state,action) {
        state.show_form = true
        state.edit_id = action.payload.edit_id
        state.selected_inventory = action.payload.selected_inventory
    },

    closeForm(state) {
        state.show_form = false
        state.edit_id = null
        state.selected_inventory = {}
    }
};


const extraReducers = (builder) => {
    builder
        .addCase(loadInventoryList.pending, (state, action) => {
            state.status = "loading"
        })

        .addCase(loadInventoryList.fulfilled, (state, action) => {
            // console.log("addCase getInventoryList fulfilled ", action);
            state.status = "fulfilled";
            state.inventory_list = action.payload;
            console.log('action.payload', action.payload);
        })
        .addCase(loadInventoryList.rejected, (state, action) => {
            console.log("addCase getInventoryList rejected ", action)
            state.status = "rejected"
        })
}

const inventorySlice = createSlice({
    name: 'inventories',
    initialState,
    reducers,
    extraReducers
});


export const loadInventoryList = createAsyncThunk(
    'inventories/getInventoryList',
    async ({session_id,organisation_id,kb_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/parquets/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/0/10';
        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("inventoriesgetInventoryList",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("inventoriesgetInventoryList error",error)
                    return error

                }
            )
    }
);




export const {showAddForm, showEditForm, closeForm} = inventorySlice.actions;
export default inventorySlice.reducer;


///
// export async function _getInventoryList(organisation_id, kb_id, dispatch, getState) {
//     const session_id = get_session_id(getState)
//     if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
//         dispatch({type: BUSY, busy: true});
//         await Comms.http_get('/document/parquets/' + encodeURIComponent(organisation_id) + '/' +
//             encodeURIComponent(kb_id) + '/0/10', session_id,
//             (response) => {
//                 dispatch({type: GET_INVENTORIZE_LIST, inventorize_list: response.data});
//             },
//             (errStr) => {
//                 dispatch({type: ERROR, title: "Error", error: errStr})
//             }
//         )
//     }
// }