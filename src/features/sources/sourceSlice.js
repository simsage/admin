import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    source_list: [],
    source_original_ist: [],
    source_filter: null,
    source_page: 0,
    source_page_size: 10,

    selected_source: null,
    selected_source_id: null,
    data_status: 'load_now', // load_now,loading,loaded
    // busy processing / loading
    busy: false,

    status: null,

    // data form
    show_data_form: false,
    show_export_form: false,
    show_import_form: false,

    // LGPL library support / installation
    has_jcifs: false,

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

    //test
    test_result: false,
    error: false,
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
        state.data_status = 'load_now';
    },

    closeTestMessage: (state, action) => {
        state.test_result = false
        state.error = false;
    },

    closeErrorMessage: (state, action) => {
      state.show_error_form = false;
      state.error_message = undefined;
      state.error_title = undefined;
    },

    setSelectedSourceTab: (state, action) => {
        state.selected_source_tab = action.payload
    },

    // setSelectedSourceType:(state,action) => {
    //     state.selected_source_type = action.payload
    // },

    searchSource: (state, action) => {
        if (action.payload.keyword.length > 0) {
            state.source_list = state.source_original_ist.filter(list_item => {
                return list_item.name.match(new RegExp(action.payload.keyword, "i"))
            });
            state.status = 'fulfilled';
        } else {
            state.source_list = state.source_original_ist;
            state.status = "fulfilled";
        }
    },

}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state) => {
            state.busy = true;
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(getSources.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled"
            state.source_list = action.payload
            state.source_original_ist = action.payload
            state.data_status = 'loaded';
        })
        .addCase(getSources.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Could not get sources"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        .addCase(getSource.pending, (state) => {
            state.busy = true;
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(getSource.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled"
            state.selected_source = action.payload
            state.data_status = 'loaded';
        })
        .addCase(getSource.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Could not get source"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        .addCase(updateSources.fulfilled, (state, action) => {
            state.busy = false;
            state.show_import_form = false
            state.data_status = 'load_now';
        })

        .addCase(updateSources.rejected, (state, action) => {
            state.busy = false;
            state.data_status = 'load_now';
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Source Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        //deleteRecord
        .addCase(deleteSource.pending, (state) => {
            state.busy = true;
            state.status = "loading"
        })
        .addCase(deleteSource.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(deleteSource.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Source Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //processFiles
        .addCase(processFiles.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled"
            state.data_status = 'load_now';
        })
        .addCase(processFiles.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Cannot Process Files"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //startSource
        .addCase(startSource.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled"
            state.data_status = 'load_now';
            // if (action.payload.code === "ERR_BAD_RESPONSE") {
            //     state.show_error_form = true
            //     state.error_title = "Error"
            //     state.error_message = action.payload.response.data.error
            // } else {
            //     state.status = "fulfilled"
            //     state.data_status = 'load_now';
            // }
        })
        .addCase(startSource.rejected, (state, action) => {
            console.log('action rejected', action)
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = 'Error'
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        // JCIFS check
        .addCase(checkJcifsLibrary.pending, (state) => {
            state.busy = true;
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(checkJcifsLibrary.fulfilled, (state, action) => {
            state.busy = false;
            state.has_jcifs = (action.payload.information === "true" || action.payload.information === "True");
            state.data_status = 'loaded';
        })
        .addCase(checkJcifsLibrary.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Error"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })


        // JCIFS install
        .addCase(installJcifsLibrary.pending, (state) => {
            state.busy = true;
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(installJcifsLibrary.fulfilled, (state, action) => {
            state.busy = false;
            state.has_jcifs = true;
            state.data_status = 'loaded';
        })
        .addCase(installJcifsLibrary.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.data_status = "rejected"
            state.show_error_form = true
            state.error_title = "Error"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //testSource
        .addCase(testSource.pending, (state) => {
            state.busy = true;
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(testSource.fulfilled, (state, action) => {
            state.busy = false;
            state.data_status = 'loaded';
            state.test_result = 'Success'
        })
        .addCase(testSource.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.data_status = "rejected"
            // state.error = {
            //     code: 'Test Failed',
            //     message: 'Please double check your configuration'
            // }
            state.test_result = 'Failed'
            state.error_title = "Connection Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

}


export const getSources = createAsyncThunk(
    'sources/getSources',
    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


export const getSource = createAsyncThunk(
    'sources/getSource',
    async ({session_id, organisation_id, kb_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
            return rejectWithValue(err?.response?.data)
        })
    }
);


// https://uat.simsage.ai/api/crawler/crawler
// POST
export const updateSources = createAsyncThunk(
    'sources/updateSources',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })

    });


// https://adminux.simsage.ai/api/crawler/start/
export const startSource = createAsyncThunk(
    'sources/startSource',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/start';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })

    });


export const deleteSource = createAsyncThunk(
    'sources/deleteSource',
    async ({session_id, organisation_id, kb_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


// https://uat.simsage.ai/api/document/zip/source/
// POST
export const zipSource = createAsyncThunk(
    'sources/zipSource',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/document/zip/source';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


//crawler/process-all-files
export const processFiles = createAsyncThunk(
    'sources/processFiles',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/process-all-files';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


export const checkJcifsLibrary = createAsyncThunk(
    'sources/checkJcifsLibrary',
    async ({session_id, organisation_id, callback}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/has-jcifs/' + encodeURIComponent(organisation_id);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


export const installJcifsLibrary = createAsyncThunk(
    'sources/installJcifsLibrary',
    async ({session_id, organisation_id, callback}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/install-jcifs/' + encodeURIComponent(organisation_id);
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });

export const testSource = createAsyncThunk(
    'sources/test',
    async ({session_id, organisation_id, knowledgeBase_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/crawler/crawler/test/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledgeBase_id)}/${encodeURIComponent(source_id)}`;
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log( 'testing test response', response.data)
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });



const sourceSlice = createSlice({
    name: 'sources',
    initialState,
    reducers,
    extraReducers
});

export const {
    closeErrorMessage, closeTestMessage, showAddForm, showEditForm, closeForm, showExportForm, showImportForm,
    showStartCrawlerAlert, showProcessFilesAlert, showZipCrawlerAlert, searchSource
} = sourceSlice.actions
export default sourceSlice.reducer;