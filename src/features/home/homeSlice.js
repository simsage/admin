import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import Comms from "../../common/comms";
import {filter_esc, get_cookie_value, update_cookie_value, uri_esc} from "../../common/api";

// name of the ux cookie
const ux_cookie = "ux-cookie";
// cookie values for init store
const theme = get_cookie_value(ux_cookie, "theme");

const initialState = {
    selected_tab: 'home',
    status_list: undefined,
    busy: false,            // system busy
    error_title: "Error",   // application error messages
    error: "",
    theme: theme ? theme : "light",         // light or dark

    // log settings
    log_list: [],           // list of all the logs
    log_lines: 100,         // number of lines to fetch from log
    log_type: 'All',        // error/debug/info
    log_service: 'Auth',    // default service to view
    log_refresh: 0,         // refresh in seconds
    log_filtered_list: [],  // filtered list based off search
}


// {}
export const getLogs = createAsyncThunk(
    'home/getLogs',
    async ({session_id, organisation_id, log_type, log_service, log_lines, filter},
           {rejectWithValue}) => {
        const api_base = window.ENV.api_base;

        const url = '/stats/system-logs/' +
            uri_esc(organisation_id) + '/' +
            uri_esc(log_service) + '/' +
            uri_esc(log_lines) + '/' +
            filter_esc(filter ? filter : 'null')

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                response.data.log_type = log_type
                return response.data;
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


const extraReducers = (builder) => {
    builder
        .addCase(getLogs.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getLogs.fulfilled, (state, action) => {
            const log_list = action.payload?.logList ? action.payload.logList : [];
            const list = [];
            const log_type_lwr = action.payload?.log_type?.toLowerCase() ?? "all"
            for (let i = 0; i < log_list.length; i++) {
                const item = log_list[i];
                if (log_type_lwr === 'all' || item.type.toLowerCase() === log_type_lwr) {
                    list.push(item);
                }
            }
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: "loaded",
                log_list: list
            }

        })
        .addCase(getLogs.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Failed to load Logs",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}


export const homeSlice = createSlice({
    name: 'home',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        toggleTheme: (state, action) => {
            const new_theme = (state.theme === "light" ? "dark" : "light")
            update_cookie_value(ux_cookie, 'theme', new_theme)
            return {
                ...state,
                theme: new_theme
            }
        },

        selectTab: (state, action) => {
            return {
                ...state,
                selected_tab: action.payload
            }
        },

        setLogService: (state, action) => {
            return {
                ...state,
                log_service: action.payload
            }
        },

        setNumLogLines: (state, action) => {
            return {
                ...state,
                log_lines: action.payload
            }
        },

        setLogType: (state, action) => {
            return {
                ...state,
                log_type: action.payload
            }
        },
        closeErrorMessage: (state, _) => {
            return {
                ...state,
                show_error_form: false,
                error_message: undefined,
                error_title: undefined
            }
        },


    },
    extraReducers
})


export const {
    closeErrorMessage,
    selectTab,
    setNumLogLines,
    setLogService,
    setLogType,
    toggleTheme,
    searchForLogs
} = homeSlice.actions

export default homeSlice.reducer
