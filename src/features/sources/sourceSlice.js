import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    source_list: [],
    source_original_ist: [],
    failed_documents: [],
    failed_document_total: 0,
    source_filter: '',
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
    show_failed_docs: false,

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

    showFailedDocuments: (state, action) => {
        state.show_failed_docs = true
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
        state.show_failed_docs = false
        state.selected_source = null
        state.selected_source_id = null
        state.show_import_form = false

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

    searchSource: (state, action) => {
        return {...state, source_filter: action.payload.keyword};
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


        .addCase(updateSource.fulfilled, (state, action) => {
            state.busy = false;
            state.show_import_form = false
            state.data_status = 'load_now';
        })

        .addCase(updateSource.rejected, (state, action) => {
            state.busy = false;
            state.data_status = 'load_now';
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Source Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        .addCase(getFailedDocuments.fulfilled, (state, action) => {
            state.busy = false;
            state.failed_documents = action.payload.results
            state.failed_document_total = action.payload.total
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
        })
        .addCase(startSource.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = 'Error'
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


        .addCase(resetSourceDelta.pending, (state, action) => {
            state.busy = true;
        })
        .addCase(resetSourceDelta.fulfilled, (state, action) => {
            state.busy = false;
            alert("source delta-token reset successful");
        })
        .addCase(resetSourceDelta.rejected, (state, action) => {
            state.busy = false;
        })

}


export const getFailedDocuments = createAsyncThunk(
    'sources/getFailedDocuments',
    async (
        {session_id, organisation_id, kb_id, source_id, page, pageSize},
        {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/faileddocs/' +
            encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' +
            encodeURIComponent(source_id) + "/" +
            page + "/" +
            pageSize;
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);

export const getSources = createAsyncThunk(
    'sources/getSources',
    async ({session_id, organisation_id, kb_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                if (response.data.documentSimilarityThreshold < 1.0)
                    response.data.documentSimilarityThreshold = response.data.documentSimilarityThreshold * 100
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
                if (response.data.documentSimilarityThreshold < 1.0)
                    response.data.documentSimilarityThreshold = response.data.documentSimilarityThreshold * 100
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


// https://uat.simsage.ai/api/crawler/crawler
// POST
export const updateSource = createAsyncThunk(
    'sources/updateSource',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                response.data.documentSimilarityThreshold = response.data.documentSimilarityThreshold / 100
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


export const testSource = createAsyncThunk(
    'sources/test',
    async ({session_id, organisation_id, knowledgeBase_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/crawler/crawler/test/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledgeBase_id)}/${encodeURIComponent(source_id)}`;
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


export const resetSourceDelta = createAsyncThunk(
    'sources/reset-delta',
    async ({session_id, organisation_id, knowledgeBase_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/crawler/crawler/reset-delta/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledgeBase_id)}/${encodeURIComponent(source_id)}`;
        return axios.post(url, {}, Comms.getHeaders(session_id))
            .then((response) => {
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
    closeErrorMessage,
    closeTestMessage,
    showAddForm,
    showEditForm,
    showFailedDocuments,
    closeForm,
    showExportForm,
    showImportForm,
    showStartCrawlerAlert,
    showProcessFilesAlert,
    showZipCrawlerAlert,
    searchSource
} = sourceSlice.actions

// assure we clear any operational values from the source before importing or exporting
export const safeSourceForImportOrExport = (source, overlay={}) => {
    const clone = {...source, ...overlay}

    clone.deltaIndicator = ""
    clone.startTime = 0
    clone.endTime = 0
    clone.numErrors = 0
    clone.numCrawledDocuments = 0
    clone.numConvertedDocuments = 0
    clone.numParsedDocuments = 0
    clone.numIndexedDocuments = 0
    clone.numFinishedDocuments = 0
    clone.numErroredDocuments = 0
    clone.numTotalDocuments = 0
    clone.numTotalErroredDocuments = 0

    delete clone.sourceId

    return clone
}


export default sourceSlice.reducer;