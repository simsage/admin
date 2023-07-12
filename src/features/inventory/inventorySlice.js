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
    show_add_info_form: false,
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

    showAddInfoForm(state, action) {
        state.show_add_info_form = action.payload
    },

    closeForm(state) {
        state.show_form = false;
        state.edit_id = null;
        state.selected_inventory = {};
        state.show_document_snapshot_form = false;
        state.show_index_snapshot_form = false;
        state.show_delete_form = false;
        state.show_add_info_form = false;
    },
    closeErrorMessage: (state, action) => {
        state.show_error_form = false;
        state.error_message = undefined;
        state.error_title = undefined;
    },
};


const extraReducers = (builder) => {
    builder
        .addCase(loadInventoryList.pending, (state) => {
            state.status = "loading"
        })

        .addCase(loadInventoryList.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.inventory_list = action.payload;
            state.data_status = 'loaded';
        })
        .addCase(loadInventoryList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Failed to load Inventory list"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

    //Document Snapshot
        .addCase(createDocumentSnapshot.pending, (state) => {
            state.status = "loading"
        })
        .addCase(createDocumentSnapshot.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createDocumentSnapshot.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_add_info_form = false
            state.show_error_form = true
            state.error_title = "Failed to create document snapshot"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

    //Index Snapshot
        .addCase(createIndexSnapshot.pending, (state) => {
            state.status = "loading"
        })
        .addCase(createIndexSnapshot.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(createIndexSnapshot.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_add_info_form = false
            state.show_error_form = true
            state.error_title = "Failed to create index snapshot"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

    //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            state.status = "loading"
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
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
    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/parquets/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/0/10';
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


export const createDocumentSnapshot = createAsyncThunk(
    'inventories/createDocumentSnapshot',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });

//api/document/inventorize-indexes
export const createIndexSnapshot = createAsyncThunk(
    'inventories/createIndexSnapshot',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/inventorize-indexes';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })

    });


//document/parquet/01866e90-94c4-34bc-4fdd-56c20770b2d7/018674f9-8b4e-7a9f-577d-33a6726913a8/1677053053812
///document/parquet/{organisationId}/{kbId}/{dateTime}
export const deleteRecord = createAsyncThunk(
    'inventories/deleteRecord',
    async ({session_id, organisation_id, kb_id, inventory_date_time} ,{rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/parquet/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id)+ '/' + encodeURIComponent(inventory_date_time);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const {
    showAddForm,
    showEditForm,
    closeForm,
    closeErrorMessage,
    showDocumentSnapshotForm,
    showIndexSnapshotForm,
    showDeleteInventoryForm,
    showAddInfoForm
} = inventorySlice.actions;
export default inventorySlice.reducer;
