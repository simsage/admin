import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    inventory_list: [],
    inventor_busy: false,
    status: null,
    error: null,
    show_form: false,
    selected_inventory: {},
    data_status: 'load_now',//load_now,loading,loaded

    show_document_snapshot_form: false,
    show_index_snapshot_form: false,
    show_delete_form: false,
    show_add_info_form: false,
};

const reducers = {
    showAddForm(state) {
        return {
            ...state,
            show_form: true
        }
    },

    showEditForm(state, action) {
        return {
            ...state,
            show_form: true,
            edit_id: action.payload.edit_id,
            selected_inventory: action.payload.selected_inventory
        }
    },

    showDocumentSnapshotForm(state) {
        return {
            ...state,
            show_document_snapshot_form: true
        }
    },

    showIndexSnapshotForm(state) {
        return {
            ...state,
            show_index_snapshot_form: true
        }
    },

    showDeleteInventoryForm(state,action) {
        return {
            ...state,
            show_delete_form: true,
            selected_inventory: action.payload.inventory
        }
    },

    showAddInfoForm(state, action) {
        return {
            ...state,
            show_add_info_form: action.payload
        }
    },

    closeForm(state) {
        return {
            ...state,
            show_form: false,
            edit_id: null,
            selected_inventory: {},
            show_document_snapshot_form: false,
            show_index_snapshot_form: false,
            show_delete_form: false,
            show_add_info_form: false
        }
    },
    closeErrorMessage: (state, _) => {
        return {
            ...state,
            show_error_form: false,
            error_message: undefined,
            error_title: undefined
        }
    },
};


const extraReducers = (builder) => {
    builder
        .addCase(loadInventoryList.pending, (state) => {
            return {
                ...state,
                inventor_busy: true,
                status: "loading"
            }
        })

        .addCase(loadInventoryList.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                inventor_busy: false,
                inventory_list: action.payload,
                data_status: 'loaded'
            }
        })
        .addCase(loadInventoryList.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                inventor_busy: false,
                data_status: "rejected",
                show_error_form: true,
                error_title: "Failed to load Inventory list",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Document Snapshot
        .addCase(createDocumentSnapshot.pending, (state) => {
            return {
                ...state,
                status: "loading"
            }
        })
        .addCase(createDocumentSnapshot.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now"
            }
        })
        .addCase(createDocumentSnapshot.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_add_info_form: false,
                show_error_form: true,
                error_title: "Failed to create document snapshot",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Index Snapshot
        .addCase(createIndexSnapshot.pending, (state) => {
            return {
                ...state,
                status: "loading"
            }
        })
        .addCase(createIndexSnapshot.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now"
            }
        })
        .addCase(createIndexSnapshot.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_add_info_form: false,
                show_error_form: true,
                error_title: "Failed to create index snapshot",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //deleteRecord
        .addCase(deleteRecord.pending, (state) => {
            return {
                ...state,
                status: "loading"
            }
        })
        .addCase(deleteRecord.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: 'load_now'
            }
        })
        .addCase(deleteRecord.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}


const inventorySlice = createSlice({
    name: 'inventories',
    initialState,
    reducers,
    extraReducers
});


export const loadInventoryList = createAsyncThunk(
    'inventories/loadInventoryList',
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
    closeForm,
    closeErrorMessage,
    showDocumentSnapshotForm,
    showIndexSnapshotForm,
    showDeleteInventoryForm,
    showAddInfoForm
} = inventorySlice.actions;
export default inventorySlice.reducer;
