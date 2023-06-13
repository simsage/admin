import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import axios from "axios";


const initialState = {
    user: {},
    session: {},

    selected_organisation: {},
    selected_organisation_id: null,
    selected_knowledge_base: {},
    selected_knowledge_base_id: null,

    message: null,

    // error dialog
    is_error: false,
    error_title: '',
    error_text: '',

    busy: false,
    status: '',

    accounts_dropdown: false,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,

    //not async function : sync functions
    reducers: {

        setSelectedOrganisation: (state, action) => {
            if (state.selected_organisation_id !== action.payload.id) {
                state.selected_organisation = action.payload;
                state.selected_organisation_id = action.payload.id;
                state.selected_knowledge_base = {};
                state.selected_knowledge_base_id = null
            }
        },

        setSelectedKB: (state, action) => {
            state.selected_knowledge_base_id = action.payload;
        },

        showError: (state, action) => {
            console.log("showError", action.payload);
            if (action && action.payload && action.payload.title && action.payload.message) {
                state.is_error = true;
                state.error_title = action.payload.title;
                state.error_text = action.payload.message;
            }
        },

        closeError: (state) => {
            state.is_error = false;
        },

        login: (state, action) => {
            state.user = action.payload.user
            state.message = ''
            state.session = action.payload.session


            const org_list = action.payload.organisationList

            if (org_list.length) {
                for (let i = 0; i < org_list.length; i++) {
                    if (org_list[i] && org_list[i]['id'] === action.payload.organisationId) {
                        state.selected_organisation = org_list[i];
                        state.selected_organisation_id = org_list[i].id;
                    }
                }
            } else {
                state.selected_organisation = action.payload.organisationId;
                state.selected_organisation_id = action.payload.organisationId;
            }

            state.status = 'logged_in'
        },

        showAccount: (state, action) => {
            state.accounts_dropdown = !state.accounts_dropdown;
        },

        closeAllMenus: (state) => {
            state.accounts_dropdown = false
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(simsageSignIn.pending, (state) => {
                state.busy = true;
                state.status = "loading";
            })
            .addCase(simsageSignIn.fulfilled, (state, action) => {
                state.busy = false;
                state.status = "fulfilled";
            })
            .addCase(simsageSignIn.rejected, (state) => {
                state.busy = false;
                state.status = "rejected";
            })
    }
});


export const simsageLogOut = createAsyncThunk(
    'auth/Logout',
    async ({session_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/sign-out'

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("Logging out", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("Logging out error", error.response.data.error)
                    return error
                }
            )
    }
)


export const simsageSignIn = createAsyncThunk(
    'auth/signIn',
    async ({id_token, on_success, on_fail}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/admin/authenticate/msal';
        axios.get(url,{
            headers: {"API-Version": window.ENV.api_version,
                "Content-Type": "application/json",
                "jwt": id_token,}
        })
            .then(function (response2) {
                if (on_success)
                    on_success(response2.data);
                return response2.data;
            })
            .catch((error) => {
                console.error("SimSage sign-in error:",error);
                if (on_fail)
                    on_fail(error.message);
                return error;
            });
    }
)


export const {
    reset, login, showAccount, closeAllMenus, setSelectedOrganisation, closeError,
    setJwt, showError, setSelectedKB
} = authSlice.actions

export default authSlice.reducer;
