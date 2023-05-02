import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    selected_tab: 'home',
    status_list:undefined,
    theme: null,
    license: undefined,          // system license
    uploading: undefined,       // program busy uploading
    busy: undefined,            // system busy
    error_title: "Error",   // application error messages
    error: "",

    // log settings
    log_list: [],           // list of all the logs
    log_hours: 1,           // number of hours back in time
    log_type: 'All',        // error/debug/info
    log_service: 'All',     // service to view
    log_refresh: 0,         // refresh in seconds

};




export const getStatus = createAsyncThunk(
    'home/getStatus',
    async ({session_id, organisation_id, kb_id}) => {
        console.log("sources/getSources");
        const api_base = window.ENV.api_base;
        // http://localhost:8080/api/crawler/crawlers/c276f883-e0c8-43ae-9119-df8b7df9c574/46ff0c75-7938-492c-ab50-442496f5de51

        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);


// {}
export const getLogs = createAsyncThunk(
    'home/getLogs',
    async ({session_id, organisation_id, log_type, log_service, log_hours}) => {
        const api_base = window.ENV.api_base;

        // calculate the correct time for the server
        const localDate = new Date();
        const date = new Date((localDate.valueOf() + localDate.getTimezoneOffset() * 60000) - ((log_hours - 1) * 3600_000));
        let year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();

        const url = '/stats/system-logs/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(year) + '/' +
            encodeURIComponent(month) + '/' + encodeURIComponent(day) + '/' + encodeURIComponent(hour) + '/' +
            encodeURIComponent(log_hours)
        console.log('GET ' + api_base + url);

        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                const log_list = response.data.logList ? response.data.logList : [];
                const list = [];
                for (let i = 0; i < log_list.length; i++) {
                    const item = log_list[i];
                    if ((log_type === 'All' || item.type === log_type) &&
                        (log_service === 'All' || item.service === log_service)) {
                        list.push(item);
                    }
                }
                return list;
            }).catch(
                (error) => {return error}
            )
    }
);


const extraReducers = (builder) => {
    builder
        .addCase(getStatus.pending, (state) => {
            state.status = "loading"
        })
        .addCase(getStatus.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.source_list = action.payload
        })
        .addCase(getStatus.rejected, (state) => {
            state.status = "rejected"
        })
        .addCase(getLogs.fulfilled, (state, action) => {
            state.log_list = action.payload;
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

        setLogHours: (state, action) => {
            state.log_hours = action.payload;
        },

        setLogService: (state, action) => {
            state.log_service = action.payload;
        },

        setLogType: (state, action) => {
            state.log_type = action.payload;
        },

        // closeAllMenus(){
        // }

    },
    extraReducers
});

export const { selectTab, setLogHours, setLogService, setLogType, closeAllMenus, showDeleteAskForm } = homeSlice.actions;

export default homeSlice.reducer;
