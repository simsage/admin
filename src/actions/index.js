import * as types from '../constants/ActionTypes'

//User Management
export const setUserList = (text) => {
    return({type: types.SET_USER_LIST, data: text})
}

export const updateUser = text => ({type: types.UPDATE_USER, data: text})
// export const SET_USER_FILTER = "set user filter";
// export const SET_USER_PAGE = "set user page";
// export const SET_USER_PAGE_SIZE = "set user page size";