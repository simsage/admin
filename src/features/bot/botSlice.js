import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    mind_item_list: [],
    total_mind_items: 0,
    page_size: 10,
    mind_current_page_number: 0,
    status: null,
    show_memory_form: false,
    edit: undefined,
    data_status: 'load_now',
    show_delete_form: false,
    show_import_form: false,
    show_bot_import_form: false,
    show_add_info_form: false,
}

export const loadMindItems = createAsyncThunk(
    "bot/loadMindItems",
    async ({session_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/mind/memories';

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const updateMindItem = createAsyncThunk(
    'bot/updateMindItem',
    async ({session_id, organisation_id, knowledge_base_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/mind/memory/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}`

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteMindItem = createAsyncThunk(
    'bot/deleteMindItem',
    async ({session_id, organisation_id, knowledge_base_id, id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/mind/memory/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}/${encodeURIComponent(id)}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)
export const deleteAllMindItems = createAsyncThunk(
    'bot/deleteAllMindItem',
    async ({session_id, organisation_id, knowledgeBase_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/mind/delete-all/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledgeBase_id)}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


///api/knowledgebase/upload
export const importBotItems = createAsyncThunk(
    'bot/importBotItems',
    async ({session_id,data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/knowledgebase/upload';

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })

    }
)

const extraReducers = (builder) => {
    builder
        .addCase(loadMindItems.pending, (state) => {
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(loadMindItems.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.mind_item_list = action.payload.memoryList;
            state.total_mind_items = action.payload.numMemories;
            state.data_status = 'loaded';
        })
        .addCase(loadMindItems.rejected, (state) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Bot Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //update memory
        .addCase(updateMindItem.pending, (state) => {
            state.status = "loading"
        })

        .addCase(updateMindItem.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
            state.show_add_info_form = true;

        })
        .addCase(updateMindItem.rejected, (state) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Bot Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //delete memory
        .addCase(deleteMindItem.pending, (state) => {
            state.status = "loading"
        })

        .addCase(deleteMindItem.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';

        })
        .addCase(deleteMindItem.rejected, (state) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Bot Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //delete all memories
        .addCase(deleteAllMindItems.pending, (state) => {
            state.status = "loading"
        })

        .addCase(deleteAllMindItems.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';

        })
        .addCase(deleteAllMindItems.rejected, (state) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Bot Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        .addCase(importBotItems.pending, (state) => {
            state.status = "pending";
            state.data_status = 'pending';
        })
        .addCase(importBotItems.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(importBotItems.rejected, (state, action) => {
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Bot Import Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}

const botSlice = createSlice({
    name: "bot",
    initialState,
    reducers: {
        showEditMemoryForm: (state, action) => {
            state.show_memory_form = action.payload.show
            state.edit = action.payload.memory
        },
        showAddMemoryForm: (state, action) => {
            state.show_memory_form = action.payload
        },
        closeMemoryForm: (state) => {
            state.show_memory_form = false;
            state.edit = undefined;
        },
        showDeleteMemoryForm: (state, action) => {
            state.show_delete_form = action.payload.show
            state.edit = action.payload.memory
        },
        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        closeForm: (state) => {
            state.show_memory_form = false;
            state.show_delete_form = false;
            state.edit = undefined;
            state.show_import_form = false;
            state.show_add_info_form = false;
        },
        showBotImportForm:(state) => {
            state.show_bot_import_form = true;
        },
        closeBotImportForm:(state) => {
            state.show_bot_import_form = false;
        },
        showAddInfoForm(state, action) {
            state.show_add_info_form = action.payload
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
    },
    extraReducers
})


export const {
    closeErrorMessage,
    showAddInfoForm, showEditMemoryForm, showAddMemoryForm, closeMemoryForm, showDeleteMemoryForm,
    closeDeleteForm, closeForm, showBotImportForm, closeBotImportForm
} = botSlice.actions
export default botSlice.reducer
