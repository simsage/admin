import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import {useMsal} from "@azure/msal-react";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";
import {useSelector} from "react-redux";
import {useState} from "react";


const initialState = {
    user: {},
    session: {},

    selected_organisation: {},
    selected_organisation_id: null,
    selected_knowledge_base: {},
    selected_knowledge_base_id: null,

    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,

    accounts_dropdown: false,
    // jwt: undefined,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,

    //not async function : sync functions
    reducers: {

        setSelectedOrganisation: (state,action) => {
            if(state.selected_organisation_id !== action.payload.id){
                state.selected_organisation = action.payload;
                state.selected_organisation_id = action.payload.id;
                state.selected_knowledge_base = {};
                state.selected_knowledge_base_id = null
            }
        },

        setSelectedKB: (state,action) => {
            state.selected_knowledge_base_id = action.payload;
        },

        login: (state, action) => {
            state.user = action.payload.user
            state.message = ''
            state.session = action.payload.session

            const org_list = action.payload.organisationList

            if(org_list.length){
                for(let i=0; i < org_list.length; i++){
                    if(org_list[i]['id'] == action.payload.organisationId){
                        state.selected_organisation = org_list[i];
                        state.selected_organisation_id = org_list[i].id;
                    }
                }
            }else{
                state.selected_organisation = action.payload.organisationId;
                state.selected_organisation_id = action.payload.organisationId;
            }
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
                // setSelectedOrganisation()

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

export const {reset, login, showAccount, closeAllMenus, setSelectedOrganisation, logout, setJwt, setSelectedKB } = authSlice.actions
export default authSlice.reducer;
