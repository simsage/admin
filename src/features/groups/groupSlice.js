import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {filter_esc, uri_esc} from "../../common/api";

const initialState = {
    group_list: [],

    active_group_list: [],
    active_group_list_size: 0,
    available_group_list: [],
    available_group_list_size: 0,

    status: undefined,
    error: undefined,
    show_group_form: false,
    show_delete_form: false,
    show_error_message: false,
    error_message: undefined,
    edit_group: undefined,
    edit_group_user_id_list: [],
    group_text_filter: '',
    data_status: "load_now"
}

export const getGroupList = createAsyncThunk(
    'groups/getGroupList',
    async ({session_id, organization_id, page, page_size, filter}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/groups-paginated/' + uri_esc(organization_id) + '/' +
            uri_esc(page ? page : 0) + '/' +
            uri_esc(page_size ? page_size : 100) + '/' +
            filter_esc(filter);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
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
        const url = api_base + `/auth/group/${uri_esc(organisation_id)}/${filter_esc(name)}`;

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


/**
 * edit ACLs and group inside those ACLs
 *
 * @param session_id the session
 * @param organization_id the org to get ACL/groups for
 * @param active_groups_page the page index for the active groups
 * @param active_groups_filter the filter (if not empty) for the active groups
 * @param active_groups_list the list of existing active groups
 * @param available_groups_page the page for the actual groups
 * @param available_groups_filter the filter for the actual groups
 * @param page_size the size of number of groups to get each time for both sides
 */
export const getACLEditInformation = createAsyncThunk(
    'groups/getACLEditInformation',
    async ({
               session_id,
               organization_id,
               active_groups_page,
               active_groups_filter,
               active_groups_list,
               available_groups_page,
               available_groups_filter,
               page_size = 10
           }, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const data = {
            "groupList": active_groups_list,
            "activeGroupsPage": active_groups_page,
            "activeGroupsFilter": active_groups_filter,
            "availableGroupsPage": available_groups_page,
            "availableGroupsFilter": available_groups_filter,
            "pageSize": page_size
        };
        const url = api_base + '/auth/acl-edit-info/' + uri_esc(organization_id);
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


const extraReducers = (builder) => {
    builder
        //GET GROUPS
        .addCase(getGroupList.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getGroupList.fulfilled, (state, action) => {
            const group_list = (action.payload && action.payload.groupList) ? action.payload.groupList : []
            return {
                ...state,
                status: "fulfilled",
                data_status: "loaded",
                group_count: action.payload.groupCount ? action.payload.groupCount : group_list.length,
                group_list: group_list
            }

        })
        .addCase(getGroupList.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Group Load Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
        //UPDATE GROUPS
        .addCase(updateGroup.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(updateGroup.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now",
                show_group_form: false,
                edit_group: undefined,
                edit_group_user_id_list: []
            }
        })
        .addCase(updateGroup.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Group Update Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
        //DELETE GROUPS
        .addCase(deleteGroup.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(deleteGroup.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now"
            }
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Group Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        ///////////////////////////////////////////////////////////////////////

        //Get Users Paginated
        .addCase(getACLEditInformation.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getACLEditInformation.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "loaded",
                active_group_list: action.payload.activeGroupList,
                active_group_list_size: action.payload.activeSize,
                available_group_list: action.payload.availableGroupList,
                available_group_list_size: action.payload.availableSize
            }
        })
        .addCase(getACLEditInformation.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "ACL/group Load Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })


}


const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        showEditGroupForm: (state, action) => {
            return {
                ...state,
                show_group_form: action.payload.show,
                edit_group: action.payload.name,
                sso_source: action.payload.ssoSource,
                edit_group_user_id_list: action.payload.userIdList
            }
        },
        showAddGroupForm: (state, action) => {
            return {
                ...state,
                show_group_form: action.payload,
                sso_source: false
            }
        },
        closeGroupForm: (state) => {
            return {
                ...state,
                show_group_form: false,
                edit_group: undefined,
                edit_group_user_id_list: []
            }
        },
        showGroupDeleteAsk: (state, action) => {
            return {
                ...state,
                show_delete_form: action.payload.show,
                edit_group: action.payload.group
            }
        },
        closeDeleteForm: (state) => {
            return {
                ...state,
                show_delete_form: false,
                edit_group: undefined
            }
        },
        showErrorMessage: (state, action) => {
            return {
                ...state,
                show_error_message: true,
                error_message: action.payload
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
        setGroupTextFilter: (state, action) => {
            return {
                ...state,
                group_text_filter: action.payload.group_text_filter ? action.payload.group_text_filter : ''
            }
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
    closeErrorMessage,
    setGroupTextFilter
} = groupSlice.actions