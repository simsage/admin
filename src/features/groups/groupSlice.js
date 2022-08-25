import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {updateUser} from "../users/usersSlice";

const initialState = {
    group_list: undefined,
    page: 0,
    page_size: 5,
    status: undefined,
    error: undefined,
    show_group_form: false,
    edit_group: undefined,
}

export const getGroupList = createAsyncThunk(
    'groups/getGroupList',
    async ({session_id,organization_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/groups/'+ encodeURIComponent(organization_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("groups",response.data)
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);

export const updateGroup = createAsyncThunk(
    'group/update',
    async ({session_id, data}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/group/' ;
        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url );
        }
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateGroup data", response.data);
                return response.data;
            }).catch(
                (error) => {return error}
            )
    }
)
const extraReducers = (builder) => {
    builder
        //GET GROUPS
        .addCase(getGroupList.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getGroupList.fulfilled, (state, action) => {
            console.log("groups/getGroupList 111",action.payload)
            state.status = "fulfilled"
            state.group_list = action.payload
        })
        .addCase(getGroupList.rejected, (state, action) => {
            state.status = "rejected"
        })
    //UPDATE GROUPS
        .addCase(updateGroup.pending, (state, action) => {
            state.status = "Loading"
        })
        .addCase(updateGroup.fulfilled, (state, action) => {
            console.log("group/update ", action);
            state.status = "fulfilled";
        })
        .addCase(updateGroup.rejected, (state, action) => {
            state.status = "rejected";
        })
}


const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        showEditGroupForm:(state,action) => {
            state.show_group_form = action.payload.show
            state.edit_group = action.payload.name
        },
        closeGroupForm:(state) => {
        state.show_group_form = false;
        state.edit_group = undefined;
        },
    },
    extraReducers
});


export default groupSlice.reducer;
export const { showEditGroupForm, closeGroupForm } = groupSlice.actions