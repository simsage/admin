import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    source_list: [],
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
    show_process_files_prompt: false,

    //test
    test_result: false,
    error: false,
}

const reducers = {
    showAddForm: (state) => {
        return {
            ...state,
            show_data_form: true
        }
    },

    showEditForm: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_data_form: true,
            selected_source: action.payload.source,
            selected_source_id: selectedSourceId
        }
    },

    showFailedDocuments: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_failed_docs: true,
            selected_source: action.payload.source,
            selected_source_id: selectedSourceId
        }
    },

    showExportForm: (state, action) => {
        return {
            ...state,
            show_export_form: true,
            selected_source: action.payload.source
        }
    },

    showImportForm: (state) => {
        return {
            ...state,
            show_import_form: true
        }
    },

    showStartCrawlerAlert: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_start_crawler_prompt: true,
            selected_source: action.payload.source,
            selected_source_id: selectedSourceId
        }
    },

    showProcessFilesAlert: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_process_files_prompt: true,
            selected_source: action.payload.source,
            selected_source_id: selectedSourceId
        }
    },


    closeForm: (state) => {
        return {
            ...state,
            show_data_form: false,
            show_export_form: false,
            show_failed_docs: false,
            selected_source: null,
            selected_source_id: null,
            show_import_form: false,

            show_start_crawler_prompt: false,
            show_process_files_prompt: false,
            data_status: 'load_now'
        }
    },

    closeTestMessage: (state) => {
        return {
            ...state,
            test_result: false,
            error: false
        }
    },

    closeErrorMessage: (state) => {
        return {
            ...state,
            show_error_form: false,
            error_message: undefined,
            error_title: undefined
        }
    },

    searchSource: (state, action) => {
        return {
            ...state, source_filter:
            action.payload.keyword
        }
    },

}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getSources.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                source_list: action.payload,
                data_status: 'loaded'
            }
        })
        .addCase(getSources.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Could not get sources",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })
        .addCase(getSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(getSource.fulfilled, (state, action) => {

            return {
                ...state,
                busy: false,
                status: "fulfilled",
                selected_source: action.payload,
                data_status: 'loaded'
            }
        })
        .addCase(getSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                data_status: "rejected",
                show_error_form: true,
                error_title: "Could not get source",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })
        .addCase(updateSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                show_import_form: false,
                data_status: 'load_now'
            }
        })
        .addCase(updateSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: "loading",
                show_error_form: false,
                error_title: "",
                error_message: ""
            }
        })
        .addCase(updateSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                data_status: 'load_now',
                status: "rejected",
                show_error_form: true,
                error_title: "Source Update Failed",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })

        .addCase(getFailedDocuments.fulfilled, (state, action) => {
            return {
                ...state,
                busy: false,
                failed_documents: action.payload.results,
                failed_document_total: action.payload.total
            }
        })
        .addCase(deleteSource.pending, (state) => { //deleteRecord
            return {
                ...state,
                busy: true,
                status: "loading"
            }
        })
        .addCase(deleteSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: "load_now"
            }
        })
        .addCase(deleteSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                show_error_form: true,
                error_title: "Source Delete Failed",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })

        //processFiles
        .addCase(processFiles.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: "load_now"
            }
        })
        .addCase(processFiles.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                show_error_form: true,
                error_title: "Cannot Process Files",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })

        //startSource
        .addCase(startSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: 'load_now'
            }
        })
        .addCase(startSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                show_error_form: true,
                error_title: 'Error',
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })


        //testSource
        .addCase(testSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(testSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                data_status: 'loaded',
                test_result: 'Success'
            }
        })
        .addCase(testSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                data_status: "rejected",
                test_result: 'Failed',
                error_title: "Connection Failed",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })


        .addCase(resetSourceDelta.pending, (state) => {
            return {
                ...state,
                busy: true
            }
        })
        .addCase(resetSourceDelta.fulfilled, (state, action) => {
            // reset indicators locally
            const source_id = action.payload.sourceId;
            const kb_id = action.payload.kbId;
            if (state.selected_source && state.selected_source.sourceId === source_id && state.selected_source.kbId === kb_id) {
                state.selected_source.deltaIndicator = "";
            }
            if (state.source_list && state.source_list.length > 0) {
                for (let source of state.source_list) {
                    if (source.sourceId === source_id && source.kbId === kb_id) {
                        source.deltaIndicator = "";
                    }
                }
            }
            alert("source delta-token reset successful");
            return {
                ...state,
                busy: false,
                source_list: state.source_list
            };
        })
        .addCase(resetSourceDelta.rejected, (state) => {
            return {
                ...state,
                busy: false
            }
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
        return axios.get(api_base + url, Comms.getHeaders(session_id)).then((response) => {
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
        return axios.get(api_base + url, Comms.getHeaders(session_id)).then((response) => {
            if (response.data.documentSimilarityThreshold < 1.0)
                response.data.documentSimilarityThreshold = response.data.documentSimilarityThreshold * 100
            return response.data
        }).catch((err) => {
            return rejectWithValue(err?.response?.data)
        })
    }
)

export const getSource = createAsyncThunk(
    'sources/getSource',
    async ({session_id, organisation_id, kb_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id)).then((response) => {
            if (response.data.documentSimilarityThreshold < 1.0)
                response.data.documentSimilarityThreshold = response.data.documentSimilarityThreshold * 100
            return response.data
        }).catch((err) => {
            return rejectWithValue(err?.response?.data)
        })
    }
)


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


/**
 * crawler/process-all-files
 */
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
                // send parameters to success call
                response.data.organisationId = organisation_id;
                response.data.kbId = knowledgeBase_id;
                response.data.sourceId = source_id;
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
    searchSource
} = sourceSlice.actions


/**
 * Assure we clear any operational values from the source before importing or exporting
 * @param source
 * @param overlay
 * @returns {*}
 */
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