import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../utilities/comms";

const initialState = {
    user_list: [],
    user_filter: '',
    user_page: 0,
    user_page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_user_edit: false,
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


    }
});


export const { showEditUser } = usersSlice.actions
export default usersSlice.reducer;