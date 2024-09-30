import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    selected_tab: 'home',
    status_list: undefined,
    theme: null,
    busy: false,            // system busy
    error_title: "Error",       // application error messages
    error: "",

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

        const url = '/stats/system-logs/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(log_service) + '/' + encodeURIComponent(log_lines) + '/' +
            encodeURIComponent(filter ? filter : 'null')

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                const log_list = response.data.logList ? response.data.logList : [];
                const list = [];
                const log_type_lwr = log_type.toLowerCase();
                const log_service_lwr = log_service.toLowerCase();
                for (let i = 0; i < log_list.length; i++) {
                    const item = log_list[i];
                    if ((log_type_lwr === 'all' || item.type.toLowerCase() === log_type_lwr) &&
                        item.service.toLowerCase() === log_service_lwr) {
                        list.push(item);
                    }
                }
                response.data.list = list;
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
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: "loaded",
                log_list: action?.payload?.list ?? []
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
    searchForLogs
} = homeSlice.actions

export default homeSlice.reducer
