import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";


const initialState = {
    user_original_list: [],
    user_list: [],
    user_text_filter: '',
    filter: undefined,
    page: 0,
    page_size: 10,
    count: 0,

    // group edit
    active_user_list: [],
    active_user_list_size: 0,
    available_user_list: [],
    available_user_list_size: 0,

    //new states
    status: undefined,
    error: undefined,
    show_user_form: false,
    show_user_bulk_form: false,
    show_delete_form: false,
    show_password_reset_form: false,
    edit_id: undefined,

    roles: ['admin', 'dms', 'manager', 'discover', 'search'],
    data_status: "load_now"
}

export const getUserListPaginated = createAsyncThunk(
    'users/getUserListPaginated',
    async ({session_id, organization_id, page = 0, page_size = 100, filter}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/users-paginated/' + encodeURIComponent(organization_id) + '/' + encodeURIComponent(page) + '/' + encodeURIComponent(page_size) + '/' + encodeURIComponent(filter);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


export const getGroupEditInformation = createAsyncThunk(
    'users/getGroupEditInformation',
    async ({
               session_id,
               organization_id,
               active_users_page,
               active_users_filter,
               active_users_id_list,
               available_users_page,
               available_users_filter,
               page_size = 10
               }, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const data = {
            "userIdList": active_users_id_list,
            "activeUsersPage": active_users_page,
            "activeUsersFilter": active_users_filter,
            "availableUsersPage": available_users_page,
            "availableUsersFilter": available_users_filter,
            "pageSize": page_size
        };
        const url = api_base + '/auth/group-edit-info/' + encodeURIComponent(organization_id);
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


export const updateUser = createAsyncThunk(
    'users/update',
    async ({session_id, organisation_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/user/';
        return axios.put(api_base + url + encodeURIComponent(organisation_id), data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const bulkUpdateUser = createAsyncThunk(
    'user/bulk',
    async ({session_id, payload}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/user/import';

        return axios.put(url, payload, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async ({session_id, user_id, organisation_id}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/auth/organisation/user/${encodeURIComponent(user_id)}/${encodeURIComponent(organisation_id)}`;

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
        //Get Users Paginated
        .addCase(getUserListPaginated.pending, (state) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(getUserListPaginated.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.user_list = action.payload.userList ? action.payload.userList : []
            state.user_original_list = action.payload.userList ? action.payload.userList : []
            state.count = action.payload.userCount ? action.payload.userCount : 0
            state.data_status = "loaded"
        })
        .addCase(getUserListPaginated.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "User Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Get Users Paginated
        .addCase(getGroupEditInformation.pending, (state) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(getGroupEditInformation.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.data_status = "loaded"
            // activeUserList : List<CMUser>, activeSize = 0
            // availableUserList : List<CMUser>, availableSize = 0
            state.active_user_list = action.payload.activeUserList;
            state.active_user_list_size = action.payload.activeSize;
            state.available_user_list = action.payload.availableUserList;
            state.available_user_list_size = action.payload.availableSize;
        })
        .addCase(getGroupEditInformation.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "User Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Update Users
        .addCase(updateUser.pending, (state) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = "load_now"
            state.show_user_form = false;
            state.edit_id = undefined;
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "User Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Bulk update
        .addCase(bulkUpdateUser.pending, (state) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(bulkUpdateUser.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = "load_now"
            state.show_user_bulk_form = false;
        })
        .addCase(bulkUpdateUser.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "User Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Delete User
        .addCase(deleteUser.pending, (state) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(deleteUser.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = "load_now"
            state.show_delete_form = false;
            state.edit_id = undefined;
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "User Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

        showAddUserForm: (state, action) => {
            state.show_user_form = action.payload
        },
        showEditUserForm: (state, action) => {
            state.show_user_form = action.payload.show
            state.edit_id = action.payload.user_id
        },
        showPasswordResetForm: (state, action) => {
            state.show_password_reset_form = action.payload.show
            state.edit_id = action.payload.user_id
        },
        closeUserForm: (state) => {
            state.show_user_form = false;
            state.show_password_reset_form = false;
            state.edit_id = undefined;
        },
        showDeleteUserAsk: (state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit_id = action.payload.user_id
        },
        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.edit_id = undefined;
        },
        setUserTextFilter: (state, action) => {
            return {...state,
                    user_text_filter: action.payload.user_text_filter ? action.payload.user_text_filter : ''
            }
        },
        orderBy: (state, action) => {

            switch (action.payload.order_by) {
                default:
                case 'first_name':
                    state.user_list = state.user_original_list.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1);
                    state.status = "fulfilled";
                    break;
                case 'last_name':
                    state.user_list = state.user_original_list.sort((a, b) => (a.surname.toLowerCase() > b.surname.toLowerCase()) ? 1 : -1);
                    state.status = "fulfilled";
                    break;
            }
        },
        showUserBulkForm: (state) => {
            state.show_user_bulk_form = true;
        },
        closeUserBulkForm: (state) => {
            state.show_user_bulk_form = false;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },

    },


    extraReducers
});


export const {
    closeErrorMessage,
    showAddUserForm,
    showEditUserForm,
    closeUserForm,
    showDeleteUserAsk,
    closeDeleteForm,
    orderBy,
    closeUserBulkForm,
    showUserBulkForm,
    showPasswordResetForm,
    setUserTextFilter
} = usersSlice.actions

export default usersSlice.reducer;
