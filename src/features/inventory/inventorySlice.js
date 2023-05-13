import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

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
        .addCase(loadInventoryList.pending, (state) => {
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
        .addCase(createDocumentSnapshot.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createDocumentSnapshot.rejected, (state) => {
            state.status = "rejected"
        })

    //Index Snapshot
        .addCase(createIndexSnapshot.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createIndexSnapshot.rejected, (state) => {
            state.status = "rejected"
        })

    //deleteRecord
        .addCase(deleteRecord.fulfilled, (state) => {
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
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize';
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
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize-indexes';
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
