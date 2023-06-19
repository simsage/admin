import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    // error dialog
    show_alert: false,
    alert_type: undefined, //[
    title: undefined,
    message: undefined,

}

//alert_type =>
//          alert-error = alert-danger,
//          alert-primary,
//          alert-secondary,
//          alert-success,
//          alert-warning,
//          alert-info


const reducers = {

    showErrorAlert: (state, action) => {
        state.show_alert = true
        state.alert_type = 'alert-error'
        state.title = action.payload.title
        state.message = action.payload.message
    },

    showDeleteAlert: (state, action) => {
        state.show_alert = true
        state.alert_type = 'alert-delete'
        state.title = action.payload.title
        state.message = action.payload.message
    },

    closeAlert: (state) => {
        state.show_alert = false
        state.alert_type = undefined
        state.title = undefined
        state.message = undefined
    },


}

const extraReducers = {}


const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers,
    extraReducers
});

export const {  showErrorAlert, showDeleteAlert, closeAlert} = alertSlice.actions
export default alertSlice.reducer;