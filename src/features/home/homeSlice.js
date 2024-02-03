import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    selected_tab: 'home',
    status_list: undefined,
    theme: null,
    license: undefined,          // system license
    uploading: undefined,       // program busy uploading
    busy: undefined,            // system busy
    error_title: "Error",   // application error messages
    error: "",

    // log settings
    log_list: [],           // list of all the logs
    log_lines: 100,         // number of lines to fetch from log
    log_type: 'All',        // error/debug/info
    log_service: 'Auth',    // default service to view
    log_refresh: 0,         // refresh in seconds

};


// {}
export const getLogs = createAsyncThunk(
    'home/getLogs',
    async ({session_id, organisation_id, log_type, log_service, log_lines}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;

        const url = '/stats/system-logs/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(log_service) + '/' + encodeURIComponent(log_lines)

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                const log_list = response.data.logList ? response.data.logList : [];
                const list = [];
                console.log("log_type", log_type);
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
);


const extraReducers = (builder) => {
    builder
        .addCase(getLogs.pending, (state) => {
            state.status = "loading";
            state.data_status = "loading";
        })
        .addCase(getLogs.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = "loaded";
            console.log(action);
            const list = action.payload.list;
            state.log_list = list ? list : [];
        })
        .addCase(getLogs.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected";
            state.show_error_form = true
            state.error_title = "Failed to load Logs"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}


export const homeSlice = createSlice({
    name: 'home',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {

        selectTab: (state, action) => {
            state.selected_tab = action.payload;
        },

        setLogService: (state, action) => {
            state.log_service = action.payload;
        },

        setNumLogLines: (state, action) => {
            state.log_lines = action.payload;
        },

        setLogType: (state, action) => {
            state.log_type = action.payload;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },

    },
    extraReducers
});


export const {
    closeErrorMessage,
    selectTab,
    setNumLogLines,
    setLogService,
    setLogType,
} = homeSlice.actions;

export default homeSlice.reducer;
