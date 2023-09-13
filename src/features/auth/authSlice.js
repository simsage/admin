import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import axios from "axios";


const initialState = {
    user: {},
    roles: [],
    session: {},
    is_admin:false,

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

    // not async function : sync functions
    // state must be pure!  see: https://github.com/facebook/react/issues/16295
    reducers: {

        setSelectedOrganisation: (state, action) => {
            if (state.selected_organisation_id !== action.payload.id) {
                return {
                    ...state,
                    selected_organisation: action.payload,
                    selected_organisation_id: action.payload.id,
                    selected_knowledge_base: {},
                    selected_knowledge_base_id: null
                }
            }
            return state;
        },

        setSelectedKB: (state, action) => {
            return {
                ...state,
                selected_knowledge_base_id: action.payload
            }
        },

        showError: (state, action) => {
            if (action && action.payload && action.payload.title && action.payload.message) {
                return {
                    ...state,
                    is_error: true,
                    error_title: action.payload.title,
                    error_text: action.payload.message
                }
            }
            return state;
        },

        closeError: (state) => {
            return {
                ...state,
                is_error: false
            }
        },

        login: (state, action) => {

            const org_list = action.payload.organisationList

            let selected_org = null;
            let selected_org_id = null;
            const logged_user_roles = action.payload.user?.roles?.map((role) => { return role.role; })
            const is_logged_user_admin = logged_user_roles.includes('admin')

            if (org_list.length) {
                for (let i = 0; i < org_list.length; i++) {
                    if (org_list[i] && org_list[i]['id'] === action.payload.organisationId) {
                        selected_org = org_list[i];
                        selected_org_id = org_list[i].id;
                        break;
                    }
                }
            } else {
                selected_org = action.payload.organisationId;
                selected_org_id = action.payload.organisationId;
            }

            return {


                ...state,
                user: action.payload.user,
                roles: logged_user_roles,
                is_admin: is_logged_user_admin,
                message: '',
                session: action.payload.session,
                status: 'logged_in',
                selected_organisation: selected_org,
                selected_organisation_id: selected_org_id,
            }
        },

        showAccount: (state) => {
            const ad = !state.accounts_dropdown;
            return {
                ...state,
                accounts_dropdown: ad,
            }
        },

        closeAllMenus: (state) => {
            return {
                ...state,
                accounts_dropdown: false,
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(simsageSignIn.pending, (state) => {
                return {
                    ...state,
                    busy: true,
                    status: "loading"
                }
            })
            .addCase(simsageSignIn.fulfilled, (state) => {
                return {
                    ...state,
                    busy: false,
                    status: "fullfilled"
                }
            })
            .addCase(simsageSignIn.rejected, (state) => {
                return {
                    ...state,
                    busy: false,
                    status: "rejected"
                }
            })
    }
});

// let abortController;
export const simsageLogOut = createAsyncThunk(
    'auth/Logout',
    async ({session_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/sign-out'

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
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

        axios.get(url, {
            headers: {
                "API-Version": window.ENV.api_version,
                "Content-Type": "application/json",
                "jwt": id_token,
            },
            // signal: abortController.signal
        })
            .then(function (response2) {
                if (on_success)
                    on_success(response2.data);
                return response2.data;
            })
            .catch((error) => {
                if (on_fail)
                    on_fail(error.message);
                return error;
            });

    }
)


export const {
    reset, login, showAccount, closeAllMenus, setSelectedOrganisation, closeError,
     showError, setSelectedKB
} = authSlice.actions

export default authSlice.reducer;
