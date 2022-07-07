import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db_users from "../../notes/db.json";
import axios from "axios";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";


const initialState = {
    user_list: undefined,
    filter: undefined,
    page: 0,
    page_size: 5,

    //new states
    status: undefined,
    error: undefined,
    show_user_form: false,
    roles: ['admin', 'operator', 'dms', 'manager']
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


const extraReducers = (builder) => {
    builder
        .addCase(getUserList.pending, (state, action) => {
            state.status = "loading"
        })
        .addCase(getUserList.fulfilled, (state, action) => {
            console.log("users/getUserList 111",action.payload)
            state.status = "fulfilled"
            state.user_list = action.payload
        })
        .addCase(getUserList.rejected, (state, action) => {
            state.status = "rejected"
        })
}


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        showAddUserForm:(state,action) => {
            state.show_user_form = action.payload
        }
    },
    extraReducers
});


export const { showAddUserForm } = usersSlice.actions
export default usersSlice.reducer;