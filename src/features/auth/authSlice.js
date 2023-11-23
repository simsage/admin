import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import axios from "axios";
import {get_error} from "../../common/api";


const initialState = {
    user: {},
    roles: [],
    session: {},
    is_admin:false,

    selected_organisation: {},
    selected_organisation_id: null,
    selected_knowledge_base: {},
    selected_knowledge_base_id: null,

    shared_secret_salt: null,

    message: null,

    // error dialog
    is_error: false,
    error_title: '',
    error_text: '',
    system_message: '',

    busy: false,
    status: '',

    accounts_dropdown: false,
}


// get the location of the current page without any query parameters - e.g. http://localhost/test/
const location = function() {
    return window.location.protocol + '//' + window.location.host + window.location.pathname;
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

        dismiss_auth_message: (state) => {
            return {...state, system_message: ''}
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
                is_error: false,
                error_text: '',
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
                shared_secret_salt: action.payload.sharedSecretSalt,
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
            .addCase(simsageSignIn.fulfilled, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    shared_secret_salt: action.payload?.sharedSecretSalt,
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

            /////////////////////////////////////////////////////////////////////////////

            .addCase(simsagePasswordSignIn.pending, (state) => {
                return {
                    ...state,
                    busy: true,
                    status: "loading"
                }
            })
            .addCase(simsagePasswordSignIn.fulfilled, (state, action) => {
                console.log(action.payload);
                if (action && action.payload && action.payload.session && action.payload.session.id) {
                    const org_list = action.payload.organisationList;

                    let selected_org = null;
                    let selected_org_id = null;
                    const logged_user_roles = action.payload.user?.roles?.map((role) => {
                        return role.role;
                    })
                    const is_logged_user_admin = logged_user_roles.includes('admin');

                    if (org_list.length > 0) {
                        for (let i = 0; i < org_list.length; i++) {
                            if (org_list[i] && org_list[i]['id'] === action.payload.organisationId) {
                                selected_org = org_list[i];
                                selected_org_id = org_list[i].id;
                                break;
                            }
                        }
                        if (!selected_org_id) {
                            selected_org = org_list[0];
                            selected_org_id = org_list[0].id;
                        }
                    }

                    return {
                        ...state,
                        user: action.payload.user,
                        roles: logged_user_roles,
                        is_admin: is_logged_user_admin,
                        message: '',
                        session: action.payload.session,
                        busy: false,
                        status: 'logged_in',
                        selected_organisation: selected_org,
                        selected_organisation_id: selected_org_id,
                    }
                } else {
                    return {
                        ...state,
                        error_text: "simsagePasswordSignIn.fulfilled: invalid parameters, invalid session object returned",
                    }
                }
            })
            .addCase(simsagePasswordSignIn.rejected, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    error_text: action.payload?.error,
                    status: "rejected"
                }
            })

            /////////////////////////////////////////////////////////////////////////////

            .addCase(requestResetPassword.pending, (state, action) => {
                state.error_text = '';
            })

            .addCase(requestResetPassword.fulfilled, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    system_message: "we've emailed you a link for resetting your password.",
                    status: "rejected"
                }
            })

            .addCase(requestResetPassword.rejected, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    error_text: get_error(action),
                    status: "rejected"
                }
            })

            /////////////////////////////////////////////////////////////////////////////

            .addCase(resetPassword.pending, (state, action) => {
                state.error_message = '';
            })

            .addCase(resetPassword.fulfilled, (state, action) => {
                const error_str = action.payload?.error;
                if (error_str && error_str.length > 0) {
                    state.search_error_text = error_str;
                } else {
                    state.system_message = "Password reset.  Click 'Back to sign in' to sign-in.";
                }
            })

            .addCase(resetPassword.rejected, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    error_text: action.payload.response?.data?.error,
                    status: "rejected"
                }
            })

            /////////////////////////////////////////////////////////////////////////////

            .addCase(simsageLogOut.pending, (state, action) => {
                state.error_message = '';
            })

            .addCase(simsageLogOut.fulfilled, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    session: null,
                    selected_organisation: {},
                    selected_organisation_id: null,
                    selected_knowledge_base: {},
                    selected_knowledge_base_id: null,
                    status: "signed-out"
                }
            })

            .addCase(simsageLogOut.rejected, (state, action) => {
                return {
                    ...state,
                    busy: false,
                    session: null,
                    selected_organisation: {},
                    selected_organisation_id: null,
                    selected_knowledge_base: {},
                    selected_knowledge_base_id: null,
                    status: "rejected"
                }
            })

    }
});

// let abortController;
export const simsageLogOut = createAsyncThunk(
    'auth/simsageLogOut',
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


export const simsagePasswordSignIn = createAsyncThunk(
    'auth/simsagePasswordSignIn',
    async ({email, password, on_success}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/sign-in';

        return axios.post(url, {"password": password, "email": email}, {
            headers: {
                "API-Version": window.ENV.api_version,
                "Content-Type": "application/json",
            },
        })
        .then(function (response2) {
            if (on_success) {
                on_success(response2.data);
            }
            return response2.data;
        })
        .catch((error) => {
            return rejectWithValue(error?.response?.data)
        });
    }
)

// password reset request
export const requestResetPassword = createAsyncThunk(
    'authSlice/requestResetPassword',
    async ({email}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/reset-password-request';
        return axios.post(url, {"email": email, "resetUrl": location()}, Comms.getHeaders(null))
            .then((response) => {
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err)
            })
    }
);


// password reset
export const resetPassword = createAsyncThunk(
    'authSlice/resetPassword',
    async ({email, reset_id, password}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/reset-password';
        return axios.post(url, {"email": email, "password": password, "resetId": reset_id}, Comms.getHeaders(null))
            .then((response) => {
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err)
            })
    }
);

export const {
    reset, login, showAccount, closeAllMenus, setSelectedOrganisation, closeError,
     showError, setSelectedKB, dismiss_auth_message
} = authSlice.actions

export default authSlice.reducer;
