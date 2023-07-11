import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";


const initialState = {
    user_original_list: [],
    user_list: [],
    filter: undefined,
    page: 0,
    page_size: 10,
    count: 0,

    //new states
    status: undefined,
    error: undefined,
    show_user_form: false,
    show_user_bulk_form: false,
    show_delete_form: false,
    show_password_reset_form:false,
    edit_id: undefined,
    roles: ['admin','operator','dms','manager','discover','search'],
    // roles: [{'admin':'Admin'}, {'operator':'Operator'}, {'dms':'DMS'}, {'manager':'Manager'},{'discover':'Discover'}],
    data_status: "load_now"
}

export const getUserListPaginated = createAsyncThunk(
    'users/getUserListPaginated',
    async ({session_id,organization_id,page=0,page_size=100,filter}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/users-paginated/'+ encodeURIComponent(organization_id)+ '/' + encodeURIComponent(page)+ '/' + encodeURIComponent(page_size)+ '/' + encodeURIComponent(filter);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);

export const updateUser = createAsyncThunk(
    'users/update',
    async ({session_id, organisation_id, data}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/user/' ;
        return axios.put(api_base + url + encodeURIComponent(organisation_id), data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch(
                (error) => {return error}
            )
    }
)

export const bulkUpdateUser = createAsyncThunk(
    'user/bulk',
    async ({session_id, payload}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/user/import';

        return axios.put(url, payload, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch(
                (error) => {return error}
            )
    }
)

export const deleteUser = createAsyncThunk (
    'users/delete',
    async ({session_id,user_id, organisation_id}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/auth/organisation/user/${encodeURIComponent(user_id)}/${encodeURIComponent(organisation_id)}`;

        return axios.delete( url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch ((error) => {return error})
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
            state.user_list = action.payload.userList?action.payload.userList:[]
            state.user_original_list = action.payload.userList?action.payload.userList:[]
            state.count = action.payload.userCount?action.payload.userCount:0
            state.data_status = "loaded"
        })
        .addCase(getUserListPaginated.rejected, (state) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })

        //Update Users
        .addCase(updateUser.pending, (state) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(updateUser.fulfilled, (state, action) => {

            if(action.payload && action.payload.code && action.payload.code === "ERR_BAD_RESPONSE") {
                state.error = action.payload.response.data.error;
                // state.show_user_form=true;
            }else {
                state.status = "fulfilled";
                state.data_status = "load_now"
            }

        })
        .addCase(updateUser.rejected, (state) => {
            state.status = "rejected";
            state.data_status = "rejected";
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
        .addCase(bulkUpdateUser.rejected, (state) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })

        //Delete User
        .addCase(deleteUser.pending, (state) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(deleteUser.fulfilled, (state) => {
            state.status = "fulfilled";
            state.data_status = "load_now"
        })
        .addCase(deleteUser.rejected, (state) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })
}


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

        showAddUserForm:(state,action) => {
            state.show_user_form = action.payload
        },
        showEditUserForm:(state,action) => {
            state.show_user_form = action.payload.show
            state.edit_id = action.payload.user_id
        },
        showPasswordResetForm:(state,action) => {
            state.show_password_reset_form = action.payload.show
            state.edit_id = action.payload.user_id
        },
        closeUserForm:(state) => {
            state.show_user_form = false;
            state.show_password_reset_form = false;
            state.edit_id = undefined;
        },
        showDeleteUserAsk:(state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit_id = action.payload.user_id
        },
        closeDeleteForm:(state) => {
            state.show_delete_form = false;
            state.edit_id = undefined;
        },
        orderBy: (state, action) => {

            switch(action.payload.order_by) {
                default:
                case 'first_name':
                    state.user_list = state.user_original_list.sort((a,b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1);
                    state.status = "fulfilled";
                    break;
                case 'last_name':
                    state.user_list = state.user_original_list.sort( (a,b) => (a.surname.toLowerCase() > b.surname.toLowerCase()) ? 1 : -1);
                    state.status = "fulfilled";
                    break;
            }
        },
        showUserBulkForm:(state) => {
            state.show_user_bulk_form = true;
        },
        closeUserBulkForm:(state) => {
            state.show_user_bulk_form = false;
        }

    },


    extraReducers
});


export const { showAddUserForm, showEditUserForm, closeUserForm,showDeleteUserAsk , closeDeleteForm, orderBy, closeUserBulkForm,showUserBulkForm,showPasswordResetForm} = usersSlice.actions
export default usersSlice.reducer;