import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import {useMsal} from "@azure/msal-react";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";
import {useSelector} from "react-redux";

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
        // reset: (state) => {
        //     state.user = null
        //     state.message = ''
        //     state.session = null
        //     state.isError = false
        //     state.isSuccess = false
        //     state.isLoading = false
        // },

        setSelectedOrganisation: (state,action) => {
            // const org_list = useSelector((state) => state.organisationReducer.organisation_list);
            state.selected_organisation = action.payload;
        },

        login: (state, action) => {
            console.log("login action", action);
            state.user = action.payload.user
            state.message = ''
            state.session = action.payload.session
            state.organisation_list = action.payload.organisation_list
            // console.log("organisation_list", state.organisation_list);
            // console.log("Auth: login action", action);
        },

        // logout: (state) => {
        //     state.session = null
        //     state.user = null
        //     console.log("logged out", state)
        // },
        //
        showAccount: (state, action) => {
            state.accounts_dropdown = !state.accounts_dropdown;
        },

        closeAllMenus: (state) => {
            state.accounts_dropdown = false
        },
        //
        // setJwt:(state, action) => {
        //     state.jwt = action.payload
        // }

    },
    extraReducers:(builder) => {
        builder
    //         .addCase(acquireTokenSilent.pending,(state) => {
    //             state.status = 'loading...'
    //         })
    //         .addCase(acquireTokenSilent.fulfilled, (state, action) => {
    //             state.status = 'fulfilled'
    //             state.jwt = action.payload
    //             console.log("fulfilled",action.data)
    //             })
    //         .addCase(acquireTokenSilent.rejected, (state) => {
    //             state.status = 'rejected'
    //         })
            .addCase(simSageSignIn.pending, (state, action) => {
            console.log("addCase simSageSignIn pending ",action)
            })
            .addCase(simSageSignIn.fulfilled, (state,action) => {
                console.log("addCase simSageSignIn fulfilled ",action)
                login(state,action);
            })
            .addCase(simSageSignIn.rejected, (state,action) => {
                console.log("addCase simSageSignIn rejected ",action)
            })
    }
});


// export const acquireTokenSilent =  createAsyncThunk(
//     'authSlider/acquireTokenSilent',
//     async (request) => {
//         const {instance, accounts} = useMsal();
//         const api_base = window.ENV.api_base;
//         const url = api_base + '/auth/admin/authenticate/msal';
//
//         await instance.acquireTokenSilent(request).then((response) => {
//             console.log(response)
//             // return response.idToken;
//         });
//     });
//


export const simSageSignIn = createAsyncThunk(
    'authSlider/simSageSignIn',
    async (jwt) => {
        console.log("simSageSignIn jwt ",jwt);
        await Comms.http_get_jwt('/auth/admin/authenticate/msal', jwt)


    }
);

export const {reset, login, showAccount, closeAllMenus, setSelectedOrganisation, logout, setJwt } = authSlice.actions
export default authSlice.reducer;