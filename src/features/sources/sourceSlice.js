import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {uri_esc} from "../../common/api";

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
    source_control_status: null,

    // set of source controls open/close in UI
    source_item_expanded: {},

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
    show_stop_crawler_prompt: false,
    show_process_files_prompt: false,
    show_pause_crawler_prompt: false,

    // Csv import for metadata
    show_csv_import: false,
    csv_import_primary_key: '',
    metadata_enhancement_list: [],

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

    // update the expanded / collapsed source items in the admin UI
    setSourceItemsExpanded: (state, action) => {
        return {
            ...state,
            source_item_expanded: action.payload
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
            failed_document_total: action.payload.source.numTotalErroredDocuments,
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

    closeCsvImportForm: (state) => {
        return {
            ...state,
            show_csv_import: false
        }
    },

    showCsvImportForm: (state, action) => {
        return {
            ...state,
            csv_import_primary_key: action.payload ?? '',
            show_csv_import: true
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

    showStopCrawlerAlert: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_stop_crawler_prompt: true,
            selected_source: action.payload.source,
            selected_source_id: selectedSourceId
        }
    },

    showPauseCrawlerAlert: (state, action) => {
        let selectedSourceId = null;
        if (state.selected_source && state.selected_source.sourceId) {
            selectedSourceId = state.selected_source.sourceId;
        }
        return {
            ...state,
            show_pause_crawler_prompt: true,
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
            show_stop_crawler_prompt: false,
            show_pause_crawler_prompt: false,
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
            ...state,
            source_filter: action.payload.keyword
        }
    },

}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state) => {
            return {
                ...state,
                status: "loading",
                data_status: "loading"
            }
        })
        .addCase(getSources.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                source_list: action.payload,
                data_status: 'loaded'
            }
        })
        .addCase(getSources.rejected, (state, action) => {
            return {
                ...state,
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
        .addCase(updateSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
                data_status: "loading",
                source_control_status: "loading",
                show_error_form: false,
                error_title: "",
                error_message: ""
            }
        })
        .addCase(updateSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                show_import_form: false,
                source_control_status: 'load_now',
                data_status: 'load_now'
            }
        })
        .addCase(updateSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                data_status: 'load_now',
                status: "rejected",
                source_control_status: "rejected",
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
                failed_documents: action.payload.results
            }
        })
        .addCase(deleteSource.pending, (state) => { //deleteRecord
            return {
                ...state,
                busy: true,
                source_control_status: "loading",
                status: "loading"
            }
        })
        .addCase(deleteSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                source_control_status: "load_now",
                data_status: "load_now"
            }
        })
        .addCase(deleteSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                source_control_status: "rejected",
                show_error_form: true,
                error_title: "Source Delete Failed",
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })

        //processFiles
        .addCase(processFiles.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading",
            }
        })
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
        .addCase(startSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                source_control_status: "loading",
                status: "loading",
            }
        })
        .addCase(startSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                source_control_status: "load_now",
                data_status: 'load_now'
            }
        })
        .addCase(startSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                source_control_status: "rejected",
                show_error_form: true,
                error_title: 'Error',
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })


        //stopSource
        .addCase(stopSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                source_control_status: "loading",
                status: "loading",
            }
        })
        .addCase(stopSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                source_control_status: "load_now",
                status: "fulfilled",
                data_status: 'load_now'
            }
        })
        .addCase(stopSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                source_control_status: "rejected",
                show_error_form: true,
                error_title: 'Error',
                error_message: action?.payload?.error ??
                    "Please contact the SimSage Support team if the problem persists"
            }
        })


        //pauseSource
        .addCase(pauseSource.pending, (state) => {
            return {
                ...state,
                busy: true,
                source_control_status: "loading",
                status: "loading",
            }
        })
        .addCase(pauseSource.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                source_control_status: "load_now",
                data_status: 'load_now'
            }
        })
        .addCase(pauseSource.rejected, (state, action) => {
            return {
                ...state,
                busy: false,
                status: "rejected",
                source_control_status: "rejected",
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

        ///////////////////////////////////////////////////////////////

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
            let selected_source = JSON.parse(JSON.stringify(state.selected_source));
            if (selected_source && selected_source.sourceId === source_id && selected_source.kbId === kb_id) {
                selected_source.deltaIndicator = "";
            }
            let source_list = JSON.parse(JSON.stringify(state.source_list));
            if (source_list && source_list.length > 0) {
                for (let source of source_list) {
                    if (source.sourceId === source_id && source.kbId === kb_id) {
                        source.deltaIndicator = "";
                    }
                }
            }
            alert("source delta-token reset successful");
            return {
                ...state,
                busy: false,
                selected_source: selected_source,
                source_list: source_list
            };
        })
        .addCase(resetSourceDelta.rejected, (state) => {
            return {
                ...state,
                busy: false
            }
        })

        ///////////////////////////////////////////////////////////////////

        // synchronizeGroups done
        .addCase(synchronizeGroups.fulfilled, (state) => {
            return {
                ...state,
                busy: false,
                status: "fulfilled",
                data_status: 'load_now'
            }
        })
        // synchronizeGroups error
        .addCase(synchronizeGroups.rejected, (state, action) => {
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

        ///////////////////////////////////////////////////////////////////////

        // import Csv Metadata
        .addCase(importCsvMetadata.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading"
            }
        })
        .addCase(importCsvMetadata.fulfilled, (state) => {
            return {
                ...state,
                status: "fulfilled",
                busy: false,
                show_csv_import: false
            }
        })
        .addCase(importCsvMetadata.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                busy: false,
                show_csv_import: true,
                show_error_form: true,
                error_title: "Csv Metadata Import Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

    ///////////////////////////////////////////////////////////////////////

        // import Csv Metadata
        .addCase(findCsvMetadata.pending, (state) => {
            return {
                ...state,
                busy: true,
                status: "loading"
            }
        })
        .addCase(findCsvMetadata.fulfilled, (state, action) => {
            return {
                ...state,
                status: "fulfilled",
                metadata_enhancement_list: action.payload,
                busy: false
            }
        })
        .addCase(findCsvMetadata.rejected, (state, action) => {
            return {
                ...state,
                status: "rejected",
                busy: false,
                show_error_form: true,
                error_title: "Csv Metadata Find Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

}


export const getFailedDocuments = createAsyncThunk(
    'sources/getFailedDocuments',
    async (
        {session_id, organisation_id, kb_id, source_id, page, pageSize},
        {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/failed-docs/' +
            uri_esc(organisation_id) + '/' +
            uri_esc(kb_id) + '/' +
            uri_esc(source_id) + "/" +
            uri_esc(page) + "/" +
            uri_esc(pageSize);
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
        const url = '/crawler/crawlers/' + uri_esc(organisation_id) + '/' + uri_esc(kb_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id)).then((response) => {
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
        const url = '/crawler/crawlers/' + uri_esc(organisation_id) + '/' + uri_esc(kb_id) + '/' + uri_esc(source_id);
        return axios.get(api_base + url, Comms.getHeaders(session_id)).then((response) => {
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
    async ({session_id, data, on_success}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                if (on_success) {
                    on_success()
                }
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


// https://adminux.simsage.ai/api/crawler/stop-crawler
export const stopSource = createAsyncThunk(
    'sources/stopSource',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/stop-crawler/' +
            uri_esc(data.organisationId) + "/" +
            uri_esc(data.kbId) + "/" +
            uri_esc(data.sourceId);
        return axios.post(url, {}, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })

    });


// https://adminux.simsage.ai/api/crawler/pause-crawler
export const pauseSource = createAsyncThunk(
    'sources/pauseSource',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/pause-crawler/' +
            uri_esc(data.organisationId) + "/" +
            uri_esc(data.kbId) + "/" +
            uri_esc(data.sourceId);
        return axios.post(url, {}, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


export const deleteSource = createAsyncThunk(
    'sources/deleteSource',
    async ({session_id, organisation_id, kb_id, source_id, on_success}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler/' +
            uri_esc(organisation_id) + '/' +
            uri_esc(kb_id) + '/' +
            uri_esc(source_id);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                if (on_success) {
                    on_success()
                }
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
        const url = api_base + `/crawler/crawler/test/${uri_esc(organisation_id)}/${uri_esc(knowledgeBase_id)}/${uri_esc(source_id)}`;
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });


export const resetSourceDelta = createAsyncThunk(
    'sources/resetSourceDelta',
    async ({session_id, organisation_id, knowledgeBase_id, source_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + `/crawler/crawler/reset-delta/${uri_esc(organisation_id)}/${uri_esc(knowledgeBase_id)}/${uri_esc(source_id)}`;
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


export const synchronizeGroups = createAsyncThunk(
    'sources/synchronizeGroups',
    async ({session_id, organisation_id, kb_id, source_id, on_success}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + "/crawler/syncgdrivegroups";

        const data = {
            organisationId: organisation_id,
            kbId: kb_id,
            sourceId: source_id
        }

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                if (on_success) {
                    on_success()
                }
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    });



export const importCsvMetadata = createAsyncThunk(
    "sources/importCsvMetadata",
    async ({
               session_id,
               organisation_id,
               kb_id,
               source_id,
               primary_key,
               text
           }, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + "/crawler/upload-metadata-enhancement-csv"

        const data = {
            organisationId: organisation_id,
            kbId: kb_id,
            sourceId: source_id,
            primaryKey: primary_key,
            text: text
        }

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const findCsvMetadata = createAsyncThunk(
    "sources/findCsvMetadata",
    async ({
               session_id,
               organisation_id,
               kb_id,
               source_id,
               filter
           }, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + "/crawler/find-metadata-enhancements"

        const data = {
            organisationId: organisation_id,
            kbId: kb_id,
            sourceId: source_id,
            filter: filter
        }

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)



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
    showStopCrawlerAlert,
    showPauseCrawlerAlert,
    showProcessFilesAlert,
    searchSource,
    closeCsvImportForm,
    showCsvImportForm,
    setSourceItemsExpanded
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
    clone.optimizedTime = 0
    clone.numErrors = 0
    clone.numCrawledDocuments = 0
    clone.numConvertedDocuments = 0
    clone.numParsedDocuments = 0
    clone.numIndexedDocuments = 0
    clone.numFinishedDocuments = 0
    clone.numErroredDocuments = 0
    clone.numInventoryDocuments = 0
    clone.numTotalInventoryDocuments = 0
    clone.numTotalDocuments = 0
    clone.numTotalErroredDocuments = 0

    delete clone.sourceId

    return clone
}


export default sourceSlice.reducer;
