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
    showAlert: (state, action) => {
        state.show_alert = true
        //default alert_type = 'alert-warning'
        state.alert_type = action.payload.alert_type ? action.payload.alert_type : 'alert-warning'
        state.title = action.payload.title
        state.message = action.payload.message
        console.log("Alert: ", state.alert_type, ' | ', state.title, ' | ', state.message)
    },

    showErrorAlert: (state, action) => {

        console.log("showErrorAlert: event received", action.payload.title, ' => ', action.payload.message)

        state.show_alert = true
        state.alert_type = 'alert-error'
        state.title = action.payload.title
        state.message = action.payload.message
        console.log("Error Alert: ", state.title, ' => ', state.message)
    },

    showDangerAlert: (state, action) => {
        state.show_alert = true
        state.alert_type = 'alert-danger'
        state.title = action.payload.title
        state.message = action.payload.message
        console.log("Error Alert: ", state.title, ' => ', state.message)
    },

    showWarningAlert: (state, action) => {
        state.show_alert = true
        state.alert_type = 'alert-warning'
        state.title = action.payload.title
        state.message = action.payload.message
        console.log("Error Alert: ", state.title, ' => ', state.message)
    },

    showSuccessAlert: (state, action) => {
        state.show_alert = true
        state.alert_type = 'alert-success'
        state.title = action.payload.title
        state.message = action.payload.message
        console.log("Error Alert: ", state.title, ' => ', state.message)
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

export const {showAlert, showDangerAlert, showErrorAlert, showSuccessAlert, showWarningAlert, closeAlert} = alertSlice.actions
export default alertSlice.reducer;