import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {filter_esc, uri_esc} from "../../common/api";


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

    // valid roles
    roles: ['admin', 'dms', 'manager', 'discover', 'search', 'tagger', 'stepwise', 'api', 'teacher'],
    data_status: "load_now"
}

export const getUserListPaginated = createAsyncThunk(
    'users/getUserListPaginated',
    async ({session_id, organization_id, page, page_size, filter}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/users-paginated/' +
            uri_esc(organization_id) + '/' +
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
        const url = api_base + '/auth/group-edit-info/' + uri_esc(organization_id);
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
        return axios.put(api_base + url + uri_esc(organisation_id), data, Comms.getHeaders(session_id))
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
        const url = api_base + `/auth/organisation/user/${uri_esc(user_id)}/${uri_esc(organisation_id)}`;

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
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getUserListPaginated.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                user_list: action.payload.userList ? action.payload.userList : [],
                user_original_list: action.payload.userList ? action.payload.userList : [],
                count: action.payload.userCount ? action.payload.userCount : 0,
                data_status: "loaded"
            }
        })
        .addCase(getUserListPaginated.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "User Load Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Get Users Paginated
        .addCase(getGroupEditInformation.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getGroupEditInformation.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "loaded",
                active_user_list: action.payload.activeUserList,
                active_user_list_size: action.payload.activeSize,
                available_user_list: action.payload.availableUserList,
                available_user_list_size: action.payload.availableSize
            }
        })
        .addCase(getGroupEditInformation.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "User Load Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Update Users
        .addCase(updateUser.pending, (state) => {
            return {
                ...state,
                status: "Loading",
                data_status: "loading"
            }
        })
        .addCase(updateUser.fulfilled, (state, _) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now",
                show_user_form: false,
                edit_id: undefined
            }
        })
        .addCase(updateUser.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "User Update Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Bulk update
        .addCase(bulkUpdateUser.pending, (state) => {
            return {
                ...state,
                status: "Loading",
                data_status: "loading"
            }
        })
        .addCase(bulkUpdateUser.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now",
                show_user_bulk_form: false
            }
        })
        .addCase(bulkUpdateUser.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "User Update Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Delete User
        .addCase(deleteUser.pending, (state) => {
            return {
                ...state,
                status: "Loading",
                data_status: "loading"
            }
        })
        .addCase(deleteUser.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                data_status: "load_now",
                show_delete_form: false,
                edit_id: undefined
            }
        })
        .addCase(deleteUser.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "User Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

        showAddUserForm: (state, action) => {
            return {
                ...state,
                show_user_form: action.payload
            }
        },
        showEditUserForm: (state, action) => {
            return {
                ...state,
                show_user_form: action.payload.show,
                edit_id: action.payload.user_id
            }
        },
        showPasswordResetForm: (state, action) => {
            return {
                ...state,
                show_password_reset_form: action.payload.show,
                edit_id: action.payload.user_id
            }
        },
        closeUserForm: (state) => {
            return {
                ...state,
                show_user_form: false,
                show_password_reset_form: false,
                edit_id: undefined
            }
        },
        showDeleteUserAsk: (state, action) => {
            return {
                ...state,
                show_delete_form: action.payload.show,
                edit_id: action.payload.user_id
            }
        },
        closeDeleteForm: (state) => {
            return {
                ...state,
                show_delete_form: false,
                edit_id: undefined
            }
        },
        setUserTextFilter: (state, action) => {
            return {
                ...state,
                user_text_filter: action.payload.user_text_filter ? action.payload.user_text_filter : ''
            }
        },
        orderBy: (state, action) => {
            switch (action.payload.order_by) {
                default:
                case 'first_name':
                    return {
                        ...state,
                        user_list: state.user_original_list.sort((a, b) =>
                                (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1),
                        status: "fulfilled"
                    }
                case 'last_name':
                    return {
                        ...state,
                        user_list: state.user_original_list.sort((a, b) =>
                            (a.surname.toLowerCase() > b.surname.toLowerCase()) ? 1 : -1),
                        status: "fulfilled"
                    }
            }
        },
        showUserBulkForm: (state) => {
            return {
                ...state,
                show_user_bulk_form: true
            }
        },
        closeUserBulkForm: (state) => {
            return {
                ...state,
                show_user_bulk_form: false
            }
        },
        setErrorMessage: (state, action) => {
            return {
                ...state,
                show_error_form: !!action.payload.error_message,
                error_message: action.payload.error_message ? action.payload.error_message : '',
                error_title: action.payload.error_title ? action.payload.error_title : 'Invalid Parameter'
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
    closeUserBulkForm,
    showUserBulkForm,
    showPasswordResetForm,
    setUserTextFilter,
    setErrorMessage
} = usersSlice.actions

export default usersSlice.reducer;
