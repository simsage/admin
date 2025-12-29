import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";
import {filter_esc, uri_esc} from "../../common/api";

const initialState = {
    organisation_original_list: [],
    organisation_filter: null,
    organisation_list: [],
    organisation_busy: false,

    status: null,
    show_error_form: false,
    error_title: undefined,
    error_message: undefined,

    show_organisation_form: false,
    edit_organisation_id: null,
    data_status: 'load_now',//load_now,loading,loaded
    show_organisation_id: false,
    show_delete_form: false,

    //for backups
    organisation_original_backup_list: [],
    organisation_backup_filter: null,
    organisation_backup_list: [],
    organisation_backup_page: 0,
    organisation_backup_page_size: 10,
    backup_data_status: 'load_now',//load_now,loading,loaded

    //backup forms
    backup_kb: null,

    //backup_progress
    show_backup_progress_message: false,

    //remove, download backup
    show_delete_backup_form: false,
    show_download_backup_form: false,
    show_restore_backup_form: false,
    selected_backup: {},
    downloaded_backup: null,

    //restore
    restore_status: null //uploading, uploaded, ready_to_upload
}

const reducers = {
    showAddOrganisationForm: (state, action) => {
        return {
            ...state,
            show_organisation_form: action.payload.show_form
        }
    },

    showEditOrganisationForm: (state, action) => {
        return {
            ...state,
            show_organisation_form: true,
            edit_organisation_id: action.payload.org_id
        }
    },

    closeOrganisationForm: (state) => {
        return {
            ...state,
            show_organisation_form: false,
            edit_organisation_id: null,
            show_organisation_id: false
        }
    },

    setOrganisationList: (state, action) => {
        return {
            ...state,
            organisation_list: action.payload.organisationList,
            organisation_original_list: action.payload.organisationList,
            status: "fulfilled",
            data_status: 'loaded'
        }
    },

    showOrganisationId: (state, action) => {
        return {
            ...state,
            show_organisation_id: true,
            edit_organisation_id: action.payload.org_id
        }
    },


    search: (state, action) => {
        if (action.payload.keyword.length > 0) {
            const regex = new RegExp(action.payload.keyword, "i")
            let temp = state.organisation_original_list.filter(list_item => {
                return list_item.name.match(regex) || list_item.id.indexOf(action.payload.keyword) >= 0
            });
            if (temp.length > 0) {
                state.organisation_list = temp
                state.status = "fulfilled";
            } else {
                state.organisation_list = [];
                state.status = "fulfilled";
            }
        } else {
            state.organisation_list = state.organisation_original_list;
            state.status = "fulfilled";
        }
    },

    showBackupForm: (state, action) => {
        return {
            ...state,
            backup_kb: action.payload.kb
        }
    },

    closeBackupForm: (state) => {
        return {
            ...state,
            backup_kb: null
        }
    },

    closeBackupProgressMessage: (state) => {
        return {
            ...state,
            show_backup_progress_message: false
        }
    },

    showDeleteBackupForm: (state, action) => {
        return {
            ...state,
            show_delete_backup_form: action.payload.show_form,
            selected_backup: action.payload.selected_backup
        }
    },

    showRestoreBackupForm: (state, action) => {
        return {
            ...state,
            show_restore_backup_form: action.payload.show_form,
            selected_backup: action.payload.selected_backup
        }
    },

    closeBackupDeleteMessage: (state) => {
        return {
            ...state,
            show_delete_backup_form: false,
            selected_backup: null
        }
    },

    closeBackupRestoreMessage: (state) => {
        return {
            ...state,
            show_restore_backup_form: false,
            selected_backup: null
        }
    },

    showDownloadBackupForm: (state, action) => {
        return {
            ...state,
            show_download_backup_form: action.payload.show_form,
            selected_backup: action.payload.selected_backup
        }
    },

    closeBackupDownloadMessage: (state) => {
        return {
            ...state,
            show_download_backup_form: false,
            selected_backup: null,
            downloaded_backup: null,
        }
    },
    showDeleteForm: (state, action) => {
        return {
            ...state,
            show_delete_form: true,
            edit_organisation_id: action.payload.org_id
        }
    },
    closeDeleteForm: (state) => {
        return {
            ...state,
            show_delete_form: false,
            edit_organisation_id: null
        }
    },
    clearOrgErrorMessage: (state) => {
        return {
            ...state,
            show_error_form: false,
            error_message: undefined,
            error_title: undefined
        }
    }


}

const extraReducers = (builder) => {
    builder
        .addCase(getOrganisationList.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(getOrganisationList.fulfilled, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                organisation_list: action.payload,
                organisation_original_list: action.payload,
                status: "fulfilled",
                data_status: 'loaded'
            }
        })
        .addCase(getOrganisationList.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Failed to load organisation list",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //update Organisation
        .addCase(updateOrganisation.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(updateOrganisation.fulfilled, (state, _) => {
            return {
                ...state,
                organisation_busy: false,
                show_organisation_form: false,
                edit_organisation_id: undefined,
                data_status: 'load_now'
            }
        })
        .addCase(updateOrganisation.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Organisation update Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //delete Organisation
        .addCase(deleteOrganisation.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(deleteOrganisation.fulfilled, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "fulfilled",
                data_status: 'load_now',
                error: action.payload,
                show_error_form: action.payload.response
            }
        })
        .addCase(deleteOrganisation.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Organisation Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //load backup list
        .addCase(getOrganisationBackupList.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(getOrganisationBackupList.fulfilled, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "fulfilled",
                organisation_backup_list: action.payload,
                organisation_original_backup_list: action.payload,
                backup_data_status: 'loaded'
            }
        })
        .addCase(getOrganisationBackupList.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Failed to load backup list",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Create Backup
        .addCase(backupKnowledgeBase.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                show_backup_progress_message: true
            }
        })
        .addCase(backupKnowledgeBase.fulfilled, (state) => {
            return {
                ...state,
                organisation_busy: false,
                show_backup_progress_message: true,
                backup_data_status: 'load_now'
            }
        })
        .addCase(backupKnowledgeBase.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Failed to Create Backup",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //delete Backup
        .addCase(deleteBackup.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading',
                backup_data_status: 'loading'
            }
        })
        .addCase(deleteBackup.fulfilled, (state) => {
            return {
                ...state,
                organisation_busy: false,
                backup_data_status: 'load_now'
            }
        })
        .addCase(deleteBackup.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Backup Delete Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //Download Backup
        .addCase(downloadBackup.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                status: "loading",
                data_status: 'loading'
            }

        })
        .addCase(downloadBackup.fulfilled, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                show_download_backup_form: false,
                downloaded_backup: action.payload
            }
        })
        .addCase(downloadBackup.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Backup Download Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })

        //restore organisation
        .addCase(restoreOrganisation.pending, (state) => {
            return {
                ...state,
                organisation_busy: true,
                restore_status: 'uploading',
                status: "loading",
                data_status: 'loading'
            }
        })
        .addCase(restoreOrganisation.fulfilled, (state) => {
            return {
                ...state,
                organisation_busy: false,
                restore_status: 'uploaded',
                data_status: "load_now"
            }
        })
        .addCase(restoreOrganisation.rejected, (state, action) => {
            return {
                ...state,
                organisation_busy: false,
                status: "rejected",
                data_status: 'rejected',
                show_error_form: true,
                error_title: "Organisation restore Failed",
                error_message:
                    action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
            }
        })
}


export const getOrganisationList = createAsyncThunk(
    'organisations/getOrganisationList',
    async ({session, filter}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/user/organisations/' + filter_esc(filter);
        return axios.get(url, Comms.getHeaders(session.id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


// /api/auth/organisation/
export const updateOrganisation = createAsyncThunk(
    'organisations/updateOrganisation',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/auth/organisation';
        return axios.put(api_base + url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


// /api/auth/organisation/{organisationId}
export const deleteOrganisation = createAsyncThunk(
    'organisations/deleteOrganisation',
    async ({session_id, organisation_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/organisation/' + uri_esc(organisation_id);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


//Organisation Backups


//https://adminux.simsage.ai/api/backup/backups/c276f883-e0c8-43ae-9119-df8b7df9c574
export const getOrganisationBackupList = createAsyncThunk(
    'organisations/getOrganisationBackupList',
    async ({session, organisation_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = '/backup/backups/' + uri_esc(organisation_id);
        const {id} = session
        return axios.get(api_base + url, Comms.getHeaders(id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);


export const downloadBackup = createAsyncThunk(
    'organisations/downloadBackup',
    async ({session, organisation_id, kb_id, backup_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/' + uri_esc(organisation_id) + '/' +
                            uri_esc(kb_id) + '/' + uri_esc(backup_id);
        Comms.download_backup(organisation_id, session.id, url)
    }
);

// /api/auth/organisation/{organisationId}
// https://adminux.simsage.ai/api/backup/backup/{organisationId}/specific
export const backupKnowledgeBase = createAsyncThunk(
    'organisations/backupKnowledgeBase',
    async ({session_id, organisation_id, kb_id, backup_level}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/backup/' +
            uri_esc(organisation_id) + '/' +
            uri_esc(kb_id) + '/' +
            uri_esc(backup_level.join(','))
        const data = {};
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


// /api/auth/organisation/{organisationId}
// https://adminux.simsage.ai/api/backup/backup/{organisationId}/specific
export const restoreOrganisation = createAsyncThunk(
    'organisations/restoreOrganisation',
    async ({session_id, data}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/restore';
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


// https://adminux.simsage.ai/api/backup/backup/c276f883-e0c8-43ae-9119-df8b7df9c574/1675160719696
export const deleteBackup = createAsyncThunk(
    'organisations/deleteBackup',
    async ({session_id, organisation_id, kb_id, backup_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/backup/' + uri_esc(organisation_id) + '/' +
                            uri_esc(kb_id) + '/' + uri_esc(backup_id);
        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


// https://adminux.simsage.ai/api/backup/restore/c276f883-e0c8-43ae-9119-df8b7df9c574/1675160719696
export const restoreBackup = createAsyncThunk(
    'organisations/deleteBackup',
    async ({session_id, organisation_id, backup_id, backup_level}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/restore/' +
            uri_esc(organisation_id) + '/' +
            uri_esc(backup_id) + '/' +
            uri_esc(backup_level.join(","))
        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


//https://adminux.simsage.ai/api/backup/c276f883-e0c8-43ae-9119-df8b7df9c574/1675160719696


const organisationSlice = createSlice({
    name: 'organisations',
    initialState,
    reducers,
    extraReducers
});

export const {
    showAddOrganisationForm,
    showEditOrganisationForm,
    closeOrganisationForm,
    setOrganisationList,
    search,
    showBackupForm,
    closeBackupForm,
    closeBackupProgressMessage,
    showDeleteBackupForm,
    showRestoreBackupForm,
    closeBackupDeleteMessage,
    closeBackupRestoreMessage,
    showDownloadBackupForm,
    closeBackupDownloadMessage,
    showOrganisationId,
    showDeleteForm,
    closeDeleteForm,
    clearOrgErrorMessage
} = organisationSlice.actions
export default organisationSlice.reducer;