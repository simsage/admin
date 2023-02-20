import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    source_list: [],
    source_filter: null,
    source_page: 0,
    source_page_size: 10,

    selected_source: null,
    selected_source_id: null,
    data_status: 'load_now',//load_now,loading,loaded

    status: null,


    // data form
    show_data_form: false,
    show_export_form: false,
    show_import_form: false,

    //error
    show_error_form: false,
    error_title: undefined,
    error_message: undefined,

    //selected source tab
    selected_source_tab: null,
    //selected source type in form
    selected_source_type: null,

    //_crawler warning
    show_start_crawler_prompt: false,
    show_zip_crawler_prompt: false,
    show_process_files_prompt: false,
}

const reducers = {
    showAddForm: (state) => {
        state.show_data_form = true
    },

    showEditForm: (state, action) => {
        state.show_data_form = true
        state.selected_source = action.payload.source
        state.selected_source_id = state.selected_source.sourceId
    },

    showExportForm: (state, action) => {
        state.show_export_form = true
        state.selected_source = action.payload.source
    },

    showImportForm: (state) => {
        state.show_import_form = true
    },

    showStartCrawlerAlert: (state, action) => {
        state.show_start_crawler_prompt = true
        state.selected_source = action.payload.source
        state.selected_source_id = state.selected_source.sourceId
    },

    showZipCrawlerAlert: (state, action) => {
        state.show_zip_crawler_prompt = true
        state.selected_source = action.payload.source
        state.selected_source_id = state.selected_source.sourceId
    },

    showProcessFilesAlert: (state, action) => {
        state.show_process_files_prompt = true
        state.selected_source = action.payload.source
        state.selected_source_id = state.selected_source.sourceId
    },


    closeForm: (state) => {
        console.log("closeForm sourceSlice")
        state.show_data_form = false
        state.show_export_form = false
        state.selected_source = null
        state.selected_source_id = null
        state.show_import_form = false

        state.show_error_form = false
        state.error_title = undefined
        state.error_message = undefined

        state.show_start_crawler_prompt = false
        state.show_zip_crawler_prompt = false
        state.show_process_files_prompt = false
    },

    setSelectedSourceTab: (state, action) => {
        state.selected_source_tab = action.payload
    },

    // setSelectedSourceType:(state,action) => {
    //     state.selected_source_type = action.payload
    // },
}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(getSources.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.source_list = action.payload
            state.data_status = 'loaded';
        })
        .addCase(getSources.rejected, (state) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })


        .addCase(getSource.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(getSource.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.selected_source = action.payload
            state.data_status = 'loaded';
        })
        .addCase(getSource.rejected, (state) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })


        .addCase(updateSources.fulfilled, (state, action) => {

            if (action.payload.response && action.payload.response.data && action.payload.response.data.error) {
                console.log("updateSources fulfilled ", action.payload.response.data.error)
                state.show_error_form = true
                state.error_title = "Error"
                state.error_message = action.payload.response.data.error

            } else {
                state.show_import_form = false
                state.show_data_form = false;
                state.selected_source = null;
                state.data_status = 'load_now';
                console.log("updateSources fulfilled ", action.payload)
            }
        })

        .addCase(updateSources.rejected, (state, action) => {
            console.log("updateSources rejected ", action)
            state.data_status = 'load_now';
            state.error = action.payload
        })


        //deleteRecord
        .addCase(deleteSource.pending, (state) => {
            state.status = "loading"
        })
        .addCase(deleteSource.fulfilled, (state, action) => {
            console.log("source/deleteSource ", action)
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(deleteSource.rejected, (state) => {
            state.status = "rejected"
        })


}


export const getSources = createAsyncThunk(
    'sources/getSources',
    async ({session_id, organisation_id, kb_id}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("sources/getSources", response.data);
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);


export const getSource = createAsyncThunk(
    'sources/getSource',
    async ({session_id, organisation_id, kb_id, source_id}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("sources/getSource", response.data);
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);


// https://uat.simsage.ai/api/crawler/crawler
// POST
export const updateSources = createAsyncThunk(
    'sources/updateSources',
    async ({session_id, data}) => {

        console.log("sources/updateSources");

        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler/';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + url);
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateSources data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error", error)
                    return error
                }
            )

    });


export const deleteSource = createAsyncThunk(
    'sources/deleteSource',
    async ({session_id, organisation_id, kb_id, source_id}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);

        if (url !== '/stats/stats/os') {
            console.log('DELETE ' + api_base + url);
        }

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("deleteRecord sources data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("deleteRecord sources error", error)
                    return error
                }
            )
    }
)


// https://uat.simsage.ai/api/document/zip/source/
// POST
export const zipSource = createAsyncThunk(
    'sources/zipSource',
    async ({session_id, organisation_id, kb_id, source_id}) => {

        console.log("sources/zipSource");

        const api_base = window.ENV.api_base;
        const url = api_base + '/document/zip/source/';

        const data = {
            "kbId": kb_id,
            "organisationId": organisation_id,
            "sourceId": source_id
        }

        if (url !== '/stats/stats/os') {
            console.log('POST ' + url);
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("zipSource data", response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error", error)
                    return error
                }
            )

    });


const sourceSlice = createSlice({
    name: 'sources',
    initialState,
    reducers,
    extraReducers
});

export const {
    showAddForm, showEditForm, closeForm, setSelectedSourceTab, showExportForm, showImportForm,
    showStartCrawlerAlert, showProcessFilesAlert, showZipCrawlerAlert
} = sourceSlice.actions
export default sourceSlice.reducer;