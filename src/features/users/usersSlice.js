import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";


const initialState = {
    user_list: undefined,
    filter: undefined,
    page: 0,
    page_size: 5,

    //new states
    status: undefined,
    error: undefined,
    show_user_form: false,
    show_delete_form: false,
    edit_id: undefined,
    roles: ['admin','operator','dms','manager','discover'],
    // roles: [{'admin':'Admin'}, {'operator':'Operator'}, {'dms':'DMS'}, {'manager':'Manager'},{'discover':'Discover'}],
    data_status: "load_now"
}


// admin - edit /delete not ow record
// manager - admin for a specific org - edit
// operator - // not to worry now
// dms - // for dms access only

// export async function _getUsers(organisation_id, filter, dispatch, getState) {
//     const session_id = get_session_id(getState)
//     dispatch({type: BUSY, busy: true});
//     if (!filter || filter.trim() === '') {
//         filter = 'null';
//     }
//     await Comms.http_get('/auth/users/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(filter), session_id,
//         (response) => {
//             dispatch({type: SET_USER_LIST, user_list: response.data});
//         },
//         (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
//     )
// }

//
// export const fetchUsers = _getUsers('users/get', async () => {
//     const response = Comms.http_get()
// })

export const getUserList = createAsyncThunk(
    'users/getUserList',
    async ({session_id,organization_id,filter}) => {
        const api_base = window.ENV.api_base;
        console.log("organization_id",organization_id)
        const url = api_base + '/auth/users/'+ encodeURIComponent(organization_id)+ '/' + encodeURIComponent(filter);

        // return "Hello";
        if (url !== '/stats/stats/os') {
            console.log('GET ' + url);
        }

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("users",response.data)
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
        if (url !== '/stats/stats/os') {
            console.log('PUT ' + api_base + url );
        }
        return axios.put(api_base + url + encodeURIComponent(organisation_id), data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateUser data", response.data);
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
        //Get Users
        .addCase(getUserList.pending, (state, action) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(getUserList.fulfilled, (state, action) => {
            console.log("users/getUserList 111",action.payload)
            state.status = "fulfilled"
            state.user_list = action.payload
            state.data_status = "loaded"
        })
        .addCase(getUserList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })

        //Update Users
        .addCase(updateUser.pending, (state, action) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            console.log("users/update ", action);
            state.status = "fulfilled";
            state.data_status = "load_now"
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })

        //Delete User
        .addCase(deleteUser.pending, (state, action) => {
            state.status = "Loading"
            state.data_status = "loading"
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            console.log("users/update ", action);
            state.status = "fulfilled";
            state.data_status = "load_now"
        })
        .addCase(deleteUser.rejected, (state, action) => {
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
        closeUserForm:(state) => {
            state.show_user_form = false;
            state.edit_id = undefined;
        },
        showDeleteUserAsk:(state, action) => {
            state.show_delete_form = action.payload.show;
            state.edit_id = action.payload.user_id
        },
        closeDeleteForm:(state, action) => {
            state.show_delete_form = false;
            state.edit_id = undefined;
        },
        orderBy: (state, action) => {

        }

        },
    extraReducers
});


export const { showAddUserForm, showEditUserForm, closeUserForm,showDeleteUserAsk , closeDeleteForm} = usersSlice.actions
export default usersSlice.reducer;