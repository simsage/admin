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
    // edit_id: null,
    // view_id: null,
    selected_inventory: {},
    data_status: 'load_now',//load_now,loading,loaded

    show_document_snapshot_form: false,
    show_index_snapshot_form: false,
    show_delete_form: false,
};

const reducers = {
    showAddForm(state) {
        state.show_form = true
    },

    showEditForm(state, action) {
        state.show_form = true
        state.edit_id = action.payload.edit_id
        state.selected_inventory = action.payload.selected_inventory
    },

    showDocumentSnapshotForm(state) {
        state.show_document_snapshot_form = true
    },

    showIndexSnapshotForm(state) {
        state.show_index_snapshot_form = true
    },

    showDeleteInventoryForm(state,action) {
        state.show_delete_form = true
        state.selected_inventory = action.payload.inventory
    },

    closeForm(state) {
        state.show_form = false;
        state.edit_id = null;
        state.selected_inventory = {};
        state.show_document_snapshot_form = false;
        state.show_index_snapshot_form = false;
        state.show_delete_form = false;
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
            state.data_status = 'loaded';
            console.log('action.payload', action.payload);
        })
        .addCase(loadInventoryList.rejected, (state, action) => {
            console.log("addCase getInventoryList rejected ", action)
            state.status = "rejected"
        })

    //Document Snapshot
        .addCase(createDocumentSnapshot.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createDocumentSnapshot.rejected, (state, action) => {
            state.status = "rejected"
        })

    //Index Snapshot
        .addCase(createIndexSnapshot.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createIndexSnapshot.rejected, (state, action) => {
            state.status = "rejected"
        })

    //deleteRecord
        .addCase(deleteRecord.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
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
    async ({session_id, organisation_id, kb_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/parquets/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/0/10';
        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("loadInventoryList", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("loadInventoryList error", error)
                    return error

                }
            )
    }
);


export const createDocumentSnapshot = createAsyncThunk(
    'inventories/createDocumentSnapshot',
    async ({session_id, data}) => {

        console.log("inventories/createDocumentSnapshot");

        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + url);
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("createDocumentSnapshot data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error", error)
                    return error
                }
            )

    });

//api/document/inventorize-indexes
export const createIndexSnapshot = createAsyncThunk(
    'inventories/createIndexSnapshot',
    async ({session_id, data}) => {

        console.log("inventories/createIndexSnapshot");

        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize-indexes';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + url);
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("createIndexSnapshot data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error", error)
                    return error
                }
            )

    });


//document/parquet/01866e90-94c4-34bc-4fdd-56c20770b2d7/018674f9-8b4e-7a9f-577d-33a6726913a8/1677053053812
///document/parquet/{organisationId}/{kbId}/{dateTime}
export const deleteRecord = createAsyncThunk(
    'inventories/deleteRecord',
    async ({session_id, organisation_id, kb_id, inventory_date_time}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/parquet/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id)+ '/' + encodeURIComponent(inventory_date_time);

        if (url !== '/stats/stats/os') {
            console.log('DELETE ' + api_base + url);
        }

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("deleteRecord data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("deleteRecord error", error)
                    return error
                }
            )
    }
)

export const {
    showAddForm,
    showEditForm,
    closeForm,
    showDocumentSnapshotForm,
    showIndexSnapshotForm,
    showDeleteInventoryForm
} = inventorySlice.actions;
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