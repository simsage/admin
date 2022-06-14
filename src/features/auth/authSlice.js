import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Comms from "../../utilities/comms";
import {useMsal} from "@azure/msal-react";
import axios from "axios";



//Get user from localStorage
let user = JSON.parse(localStorage.getItem('user'))

//TODO:For testing purpose - delete before go live

// user = {
//     "id": "90146b6f-4406-49ef-8780-efb47fcb563e",
//     "email": "siva@simsage.co.uk",
//     "firstName": "Siva",
//     "surname": "Elan",
//     "passwordHash": "",
//     "confirmed": true,
//     "roles": [
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "057df680-af6d-11ec-b559-a3a5ee669df3",
//         "role": "admin"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "5ffd40f0-9efd-11ec-8d58-0bc6a5e82008",
//         "role": "admin"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "639b4f40-9efd-11ec-8d58-0bc6a5e82008",
//         "role": "admin"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "67ef1900-9efd-11ec-8d58-0bc6a5e82008",
//         "role": "admin"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "c276f883-e0c8-43ae-9119-df8b7df9c574",
//         "role": "admin"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "c276f883-e0c8-43ae-9119-df8b7df9c574",
//         "role": "dms"
//     },
//     {
//         "userId": "90146b6f-4406-49ef-8780-efb47fcb563e",
//         "organisationId": "fe9e09c0-9efc-11ec-8d58-0bc6a5e82008",
//         "role": "admin"
//     }
// ],
//     "operatorKBList": [],
//     "groupList": []
// }

const initialState = {
    user: user ? user : null,
    session: null,
    selected_tab: null,
    selected_organisation: null,
    selected_knowledge_base: null,

    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',

    accounts_dropdown: false,
    jwt:null,


}


const authSlice = createSlice({
    name: 'auth',
    initialState,

    //not async function : sync functions
    reducers: {
        reset: (state) => {
            state.user = null
            state.message = ''
            state.session = null
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
        },

        login: (state, action) => {

            console.log(action);
            // state.user = action.payload.data.user
            // state.message = ''
            // state.session = action.payload.data.session
            // state.organisation_list = action.payload.data.organisation_list
            // console.log("login authReducer", action.payload);
            // // console.log("Auth: login action", action);
        },

        logout: (state) => {
            state.session = null
            state.user = null
            console.log("logged out", state)
        },

        showAccount: (state, action) => {
            state.accounts_dropdown = !state.accounts_dropdown;
        },

        closeAllMenus: (state) => {
            state.accounts_dropdown = false
        },

    },
    extraReducers:(builder) => {
        builder
            .addCase(acquireTokenSilent.pending,(state) => {
                state.status = 'loading...'
            })
            .addCase(acquireTokenSilent.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.jwt = action.payload
                console.log("fulfilled",action)
                })
            .addCase(acquireTokenSilent.rejected, (state) => {
                state.status = 'rejected'
            })

    }
});


export const acquireTokenSilent =  createAsyncThunk(
    'authSlider/acquireTokenSilent',
    async (request) => {
        const {instance, accounts} = useMsal();
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/admin/authenticate/msal';

        await instance.acquireTokenSilent(request).then((response) => {
            console.log(response.idToken)
            return response.idToken;
        });
    });


export const {reset, login, showAccount, closeAllMenus, logout } = authSlice.actions
export default authSlice.reducer;
