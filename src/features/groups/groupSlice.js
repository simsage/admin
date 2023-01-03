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
    edit_group: undefined,
    data_status: "load_now"
}

export const getGroupList = createAsyncThunk(
    'groups/getGroupList',
    async ({session_id, organization_id}) => {
        const api_base = window.ENV.api_base;

        console.log("groups/getGroupList organization_id", organization_id)
        console.log("groups/getGroupList session_id", session_id)
        const url = api_base + '/auth/groups/' + encodeURIComponent(organization_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("groups", response.data)
                return response.data.groupList
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);

export const updateGroup = createAsyncThunk(
    'group/update',
    async ({session_id, data}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/group/';
        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url);
        }
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateGroup data", response.data);
                return response.data;
            }).catch(
                (error) => {
                    return error
                }
            )
    }
)

export const deleteGroup = createAsyncThunk(
    'group/delete',
    async ({session_id, organisation_id, name}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/auth/group/${encodeURIComponent(organisation_id)}/${encodeURIComponent(name)}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(error => {
                console.log('error...', error.response.data.error);
                return error
            })
    }
)

const extraReducers = (builder) => {
    builder
        //GET GROUPS
        .addCase(getGroupList.pending, (state, action) => {
            state.status = "loading"
            state.data_status = "loading"
        })
        .addCase(getGroupList.fulfilled, (state, action) => {
            console.log("groups/getGroupList", action.payload)
            state.status = "fulfilled"
            state.data_status = "loaded"
            state.group_list = action.payload
        })
        .addCase(getGroupList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })
        //UPDATE GROUPS
        .addCase(updateGroup.pending, (state, action) => {
            state.status = "Loading";
            state.data_status = "loading";
        })
        .addCase(updateGroup.fulfilled, (state, action) => {
            console.log("group/update ", action);
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(updateGroup.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })
        //DELETE GROUPS
        .addCase(deleteGroup.pending, (state, action) => {
            state.status = "Loading";
            state.data_status = "loading";
        })
        .addCase(deleteGroup.fulfilled, (state, action) => {
            console.log("group/update ", action);
            state.status = "fulfilled";
            state.data_status = "load_now";
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
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
        closeDeleteForm: (state, action) => {
            state.show_delete_form = false;
            state.edit_group = undefined
        }
    },
    extraReducers
});


export default groupSlice.reducer;
export const {
    showEditGroupForm,
    showAddGroupForm,
    closeGroupForm,
    showGroupDeleteAsk,
    closeDeleteForm
} = groupSlice.actions