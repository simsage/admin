import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import axios from "axios";

const initialState = {
    organisation_original_list: [],
    organisation_filter: null,
    organisation_list: [],

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
    show_backup_form: false,
    backup_organisation_id: null,

    //backup_progress
    show_backup_progress_message: false,

    //remove, download backup
    show_delete_backup_form: false,
    show_download_backup_form: false,
    selected_backup: {},
    downloaded_backup: null,

    //restore
    restore_status: null, //uploading, uploaded, ready_to_upload
}

const reducers = {
    showAddOrganisationForm: (state, action) => {
        state.show_organisation_form = action.payload.show_form;
    },

    showEditOrganisationForm: (state, action) => {
        state.show_organisation_form = true;
        state.edit_organisation_id = action.payload.org_id;
    },

    closeOrganisationForm: (state) => {
        state.show_organisation_form = false;
        state.edit_organisation_id = null;
        state.show_organisation_id = false;
    },

    // clearDownloadedBackup: (state) => {
    //     state.downloaded_backup = null;
    // },

    setOrganisationList: (state, action) => {
        state.organisation_list = action.payload.organisationList
        state.organisation_original_list = action.payload.organisationList
        state.status = "fulfilled";
        state.data_status = 'loaded';
    },

    showOrganisationId: (state, action) => {
        state.show_organisation_id = true;
        state.edit_organisation_id = action.payload.org_id;
    },

    //
    search: (state, action) => {

        if (action.payload.keyword.length > 0) {
            let temp = state.organisation_original_list.filter(list_item => {
                return list_item.name.match(new RegExp(action.payload.keyword, "i"))
            });
            if (temp.length > 0) {
                state.organisation_list = temp
                state.status = "fulfilled";
            } else {
                // dispatchEvent(ErrorAlert({title:"Search",message:"No matching record found"}))
                state.organisation_list = [];
                state.status = "fulfilled";
            }
        } else {
            state.organisation_list = state.organisation_original_list;
            state.status = "fulfilled";
        }
    },

    // orderBy: (state, action) => {
    //
    //     switch (action.payload.order_by) {
    //         default:
    //         case 'alphabetical':
    //             state.organisation_list = state.organisation_original_list.sort((a, b) => (a.name > b.name) ? 1 : -1);
    //             state.status = "fulfilled";
    //             break;
    //         case 'recently_added':
    //             state.organisation_list = state.organisation_original_list.sort((a, b) => (a.created > b.created) ? 1 : -1);
    //             state.status = "fulfilled";
    //             break
    //     }
    // },

    showBackupForm: (state, action) => {
        state.show_backup_form = action.payload.show_form;
        state.backup_organisation_id = action.payload.org_id;
    },

    closeBackupForm: (state) => {
        state.show_backup_form = false;
        state.backup_organisation_id = null;
    },

    closeBackupProgressMessage: (state) => {
        state.show_backup_progress_message = false;
    },

    showDeleteBackupForm: (state, action) => {
        state.show_delete_backup_form = action.payload.show_form;
        // state.backup_organisation_id = action.payload.org_id;
        state.selected_backup = action.payload.selected_backup;
    },

    closeBackupDeleteMessage: (state) => {
        state.show_delete_backup_form = false;
        state.selected_backup = null;
    },

    showDownloadBackupForm: (state, action) => {
        state.show_download_backup_form = action.payload.show_form;
        state.selected_backup = action.payload.selected_backup;
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
        state.show_delete_form = true;
        state.edit_organisation_id = action.payload.org_id;
    },
    closeDeleteForm: (state) => {
        state.show_delete_form = false;
        state.edit_organisation_id = null;
    },
    clearOrgErrorMessage: (state) => {
        state.show_error_form = false;
        state.error_message = undefined;
        state.error_title = undefined;
    }


}

const extraReducers = (builder) => {
    builder
        .addCase(getOrganisationList.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(getOrganisationList.fulfilled, (state, action) => {
            state.organisation_list = action.payload;
            state.organisation_original_list = action.payload;
            state.status = "fulfilled";
            state.data_status = 'loaded';
        })
        .addCase(getOrganisationList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Failed to load organisation list"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //update Organisation
        .addCase(updateOrganisation.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(updateOrganisation.fulfilled, (state, action) => {
            state.show_organisation_form = false;
            state.edit_organisation_id = undefined;
            state.data_status = 'load_now';

        })
        .addCase(updateOrganisation.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Organisation update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //delete Organisation
        .addCase(deleteOrganisation.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(deleteOrganisation.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.data_status = 'load_now';
            state.error = action.payload
            state.show_error_form = action.payload.response
        })
        .addCase(deleteOrganisation.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Organisation Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //load backup list
        .addCase(getOrganisationBackupList.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(getOrganisationBackupList.fulfilled, (state, action) => {
            state.status = "fulfilled";
            state.organisation_backup_list = action.payload;
            state.organisation_original_backup_list = action.payload;
            state.backup_data_status = 'loaded';
        })
        .addCase(getOrganisationBackupList.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Failed to load backup list"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Create Backup
        .addCase(backupOrganisation.pending, (state) => {
            state.show_backup_progress_message = true;

        })
        .addCase(backupOrganisation.fulfilled, (state) => {
            state.show_backup_progress_message = true;
            state.backup_data_status = 'load_now';
        })
        .addCase(backupOrganisation.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Failed to Create Backup"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //delete Backup
        .addCase(deleteBackup.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
            state.backup_data_status = 'loading';
        })
        .addCase(deleteBackup.fulfilled, (state) => {
            state.backup_data_status = 'load_now';
        })
        .addCase(deleteBackup.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Backup Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //Download Backup
        .addCase(downloadBackup.pending, (state) => {
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(downloadBackup.fulfilled, (state, action) => {
            state.show_download_backup_form = false;
            state.downloaded_backup = action.payload;
        })
        .addCase(downloadBackup.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Backup Download Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //restore organisation
        .addCase(restoreOrganisation.pending, (state) => {
            state.restore_status = 'uploading';
            state.status = "loading"
            state.data_status = 'loading';
        })
        .addCase(restoreOrganisation.fulfilled, (state) => {
            state.restore_status = 'uploaded';
            state.data_status = "load_now";
        })
        .addCase(restoreOrganisation.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Organisation restore Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}


export const getOrganisationList = createAsyncThunk(
    'organisations/getOrganisationList',
    async ({session, filter}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/auth/user/organisations/' + encodeURIComponent(filter);
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
        const url = api_base + '/auth/organisation/' + encodeURIComponent(organisation_id);
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
        const url = '/backup/backups/' + encodeURIComponent(organisation_id);
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
    async ({session, organisation_id, backup_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(backup_id);
        const {id} = session
        return axios.get(url, Comms.getHeaders(id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
);

// /api/auth/organisation/{organisationId}
// https://adminux.simsage.ai/api/backup/backup/{organisationId}/specific
export const backupOrganisation = createAsyncThunk(
    'organisations/backupOrganisation',
    async ({session_id, organisation_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/backup/' + encodeURIComponent(organisation_id) + '/specific';
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
    async ({session_id, organisation_id, backup_id}, {rejectWithValue}) => {
        const api_base = window.ENV.api_base;
        const url = api_base + '/backup/backup/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(backup_id);
        return axios.delete(url, Comms.getHeaders(session_id))
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
    closeBackupDeleteMessage,
    showDownloadBackupForm,
    closeBackupDownloadMessage,
    showOrganisationId,
    showDeleteForm,
    closeDeleteForm,
    clearOrgErrorMessage
} = organisationSlice.actions
export default organisationSlice.reducer;