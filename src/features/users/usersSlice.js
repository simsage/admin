import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../utilities/comms";
import db_users from "../../notes/db.json";


const initialState = {
    users: db_users.db_users,
    user_filter: '',
    user_page: 0,
    user_page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_user_form: false,
    roles: ['admin', 'operator', 'dms', 'manager']
}

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

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        showAddUserForm:(state,action) => {
            state.show_user_form = action.payload
        }

    }
});


export const { showAddUserForm } = usersSlice.actions
export default usersSlice.reducer;