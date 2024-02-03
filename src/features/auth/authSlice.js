import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Comms from "../../common/comms";
import axios from "axios";
import {Api, get_error} from "../../common/api";


const initialState = {
    user: {},
    roles: [],
    session: {},
    is_admin: false,

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
const location = function () {
    return window.location.protocol + '//' + window.location.host + window.location.pathname;
}


const login_helper = function (login_obj) {

    let selected_org = null;
    let selected_org_id = null;
    let is_logged_user_admin = false;
    let session = null;
    let user = null;
    let organisation_list = [];
    let logged_user_roles = [];

    if (login_obj && login_obj.organisationList && login_obj.session && login_obj.session.id && login_obj.user) {
        const org_list = login_obj.organisationList

        user = login_obj.user;
        session = login_obj.session;
        organisation_list = login_obj.organisationList;

        let logged_user_roles = login_obj.user?.roles?.map((role) => {
            return role.role;
        })
        is_logged_user_admin = logged_user_roles?.includes('admin');
        if (!Api.defined(is_logged_user_admin)) {
            is_logged_user_admin = false;
        }

        if (org_list && org_list.length) {
            for (let i = 0; i < org_list.length; i++) {
                if (org_list[i] && org_list[i]['id'] === login_obj.organisationId) {
                    selected_org = org_list[i];
                    selected_org_id = org_list[i].id;
                    break;
                }
            }
        } else {
            selected_org = login_obj.organisationId;
            selected_org_id = login_obj.organisationId;
        }
    }
    return {
        selected_org: selected_org,
        selected_org_id: selected_org_id,
        logged_user_roles: logged_user_roles,
        is_logged_user_admin: is_logged_user_admin,
        user: user,
        session: session,
        organisation_list: organisation_list,
        shared_secret_salt: login_obj.sharedSecretSalt,
    }
}

export const logout = (keycloak) => {
    keycloak.logout({redirectUri: window.location.protocol + "//" + window.location.host}).then((success) => {
        console.log("--> log: logout success ", success);
    }).catch((error) => {
        console.log("--> log: logout error ", error);
    });
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
            const kb = action.payload;
            return {
                ...state,
                selected_knowledge_base: kb,
                selected_knowledge_base_id: kb?.kbId
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

            const result = login_helper(action.payload);

            let selected_organisation = state.selected_organisation;
            let selected_organisation_id = state.selected_organisation_id;
            if (!selected_organisation_id && result.selected_org) {
                selected_organisation = result.selected_org;
                selected_organisation_id = result.selected_org_id;
            }

            return {
                ...state,
                user: result.user,
                roles: result.logged_user_roles,
                is_admin: result.is_logged_user_admin,
                message: '',
                session: result.session,
                shared_secret_salt: result.shared_secret_salt,
                status: 'logged_in',
                organisation_list: result.organisation_list,
                organisation_original_list: result.organisation_list,
                selected_organisation: selected_organisation,
                selected_organisation_id: selected_organisation_id,
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

            .addCase(signInSessionId.pending, (state) => {
                return {
                    ...state,
                    busy: true,
                    status: "loading"
                }
            })
            .addCase(signInSessionId.fulfilled, (state, action) => {
                return {
                    ...state,
                    message: '',
                    busy: false,
                    status: 'logged_in',
                }
            })
            .addCase(signInSessionId.rejected, (state) => {
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
                return {
                    ...state,
                    busy: true,
                    status: "logged_in"
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
    async ({session_id, keycloak}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/sign-out'
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                logout(keycloak);
                return response
            }).catch(
                (error) => {
                    logout(keycloak);
                    return error
                }
            )
    }
)


export const simsageSignIn = createAsyncThunk(
    'auth/simsageSignIn',
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
                return response2;
            })
            .catch((error) => {
                if (on_fail)
                    on_fail(error.message);
                return error;
            });

    }
)


export const signInSessionId = createAsyncThunk(
    'auth/signInSessionId',
    async ({session_id, on_success, on_fail}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/admin/authenticate/session-id';

        axios.get(url, {
            headers: {
                "API-Version": window.ENV.api_version,
                "Content-Type": "application/json",
                "session-id": session_id,
            },
        })
            .then((response) => {
                if (on_success)
                    on_success(response.data);
                return response;
            })
            .catch((error) => {
                if (on_fail)
                    on_fail(error.message);
                return rejectWithValue(error?.response?.data)
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
                return response;
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
                return response;
            }).catch((err) => {
                return rejectWithValue(err)
            })
    }
);

export const {
    login,
    showAccount,
    closeAllMenus,
    setSelectedOrganisation,
    closeError,
    setSelectedKB,
    dismiss_auth_message
} = authSlice.actions

export default authSlice.reducer;
