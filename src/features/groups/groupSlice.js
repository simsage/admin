import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    group_list: [],
    page: 0,
    page_size: 5,
    status: undefined,
    error: undefined,
    show_group_form: false,
    show_delete_form: false,
    show_error_message: false,
    error_message: undefined,
    edit_group: undefined,
    data_status: "load_now"
}

export const getGroupList = createAsyncThunk(
    'groups/getGroupList',
    async ({session_id, organization_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/groups/' + encodeURIComponent(organization_id);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data.groupList
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);

export const updateGroup = createAsyncThunk(
    'group/update',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/group';
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteGroup = createAsyncThunk(
    'group/delete',
    async ({session_id, organisation_id, name}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/auth/group/${encodeURIComponent(organisation_id)}/${encodeURIComponent(name)}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

const extraReducers = (builder) => {
    builder
        //GET GROUPS
        .addCase(getGroupList.pending, (state) => {
            state.status = "loading"
            state.data_status = "loading"
        })
        .addCase(getGroupList.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.data_status = "loaded"
            state.group_list = action.payload
        })
        .addCase(getGroupList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Group Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //UPDATE GROUPS
        .addCase(updateGroup.pending, (state) => {
            state.status = "Loading";
            state.data_status = "loading";
        })
        .addCase(updateGroup.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(updateGroup.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "Group Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
        //DELETE GROUPS
        .addCase(deleteGroup.pending, (state) => {
            state.status = "Loading";
            state.data_status = "loading";
        })
        .addCase(deleteGroup.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "Group Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}


const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        showEditGroupForm: (state, action) => {
            state.show_group_form = action.payload.show
            state.edit_group = action.payload.name
        },
        showAddGroupForm: (state, action) => {
            state.show_group_form = action.payload;
        },
        closeGroupForm: (state) => {
            state.show_group_form = false;
            state.edit_group = undefined;
        },
        showGroupDeleteAsk: (state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit_group = action.payload.group
        },
        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.edit_group = undefined
        },
        showErrorMessage: (state, action) => {
            state.show_error_message = true;
            state.error_message = action.payload;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
    },
    extraReducers
});


export default groupSlice.reducer;
export const {
    showEditGroupForm,
    showAddGroupForm,
    closeGroupForm,
    showGroupDeleteAsk,
    closeDeleteForm,
    showErrorMessage,
    closeErrorMessage
} = groupSlice.actions