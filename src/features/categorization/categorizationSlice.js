import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    categorization_list: [],
    num_categorizations: 0,
    categorization_page_size: 10,
    categorization_page: 0,
    data_status: 'load_now',
    edit: undefined,
    // edit form
    show_categorization_form: false,
    // prompt engineer form
    show_prompt_engineering_form: false,
    form_prompt: '',
    llm_response: '',
    busy: false,
    // delete form
    show_delete_form: false,
    filter: "",
}
//organisation_id, kb_id, prev_id, categorization_filter, categorization_page_size
export const loadCategorizations = createAsyncThunk(
    "categorizations/loadCategorizations",
    async ({session_id, organisation_id, kb_id, page, page_size}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/categorization/${encodeURIComponent(organisation_id)}/${encodeURIComponent(kb_id)}/${page}/${page_size}`;

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })

export const updateCategorizations = createAsyncThunk(
    "categorizations/updateCategorization",
    async ({session_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + "/language/categorization";

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)

export const deleteCategorization = createAsyncThunk(
    "categorizations/deleteCategorization",
    async ({session_id, organisation_id, knowledge_base_id, name}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/categorization/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}/${encodeURIComponent(name)}`

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


export const testPrompt = createAsyncThunk(
    "categorizations/testPrompt",
    async ({session_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/categorization/test-prompt`

        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    }
)


const extraReducers = (builder) => {
    builder
        .addCase(loadCategorizations.pending, (state) => {
            state.busy = true;
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(loadCategorizations.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled";
            state.categorization_list = action.payload.categorizationList ? action.payload.categorizationList : [];
            state.num_categorizations = action.payload.numCategorizations ? action.payload.numCategorizations : 0;
            state.data_status = 'loaded';
        })
        .addCase(loadCategorizations.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Categorization Load Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        // update categorization
        .addCase(updateCategorizations.pending, (state) => {
            state.busy = true;
            state.status = "loading";
            state.data_status = 'loading';
        })

        .addCase(updateCategorizations.fulfilled, (state) => {
            state.busy = false;
            state.status = "fulfilled";
            state.data_status = 'load_now';
            state.show_categorization_form = false;
            state.show_prompt_engineering_form = false;
            state.edit = undefined;
        })
        .addCase(updateCategorizations.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Categorization Update Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        //delete Categorization
        .addCase(deleteCategorization.pending, (state) => {
            state.busy = true;
            state.status = "loading"
        })
        .addCase(deleteCategorization.fulfilled, (state) => {
            state.busy = false;
            state.status = "fulfilled";
            state.data_status = 'load_now';
        })
        .addCase(deleteCategorization.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected"
            state.show_error_form = true
            state.error_title = "Categorization Delete Failed"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })

        // test a prompt
        .addCase(testPrompt.pending, (state) => {
            state.busy = true;
            state.status = "loading";
            state.data_status = 'loading';
        })
        .addCase(testPrompt.fulfilled, (state, action) => {
            state.busy = false;
            state.status = "fulfilled";
            state.llm_response = action.payload.llmResponse ? action.payload.llmResponse : '';
            state.data_status = 'loaded';
        })
        .addCase(testPrompt.rejected, (state, action) => {
            state.busy = false;
            state.status = "rejected";
            state.data_status = 'rejected';
            state.show_error_form = true
            state.error_title = "Categorization test prompt"
            state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
        })
}

const categorizationSlice = createSlice({
    name: "categorizations",
    initialState,
    reducers: {
        showAddCategorizationForm: (state, action) => {
            state.show_categorization_form = action.payload
        },
        showEditCategorizationForm: (state, action) => {
            state.show_categorization_form = action.payload.show;
            state.edit = action.payload.syn;
        },
        closeCategorizationForm: (state) => {
            state.show_categorization_form = false;
            state.edit = undefined;
        },
        showPromptEngineeringForm: (state, action) => {
            if (action.payload.prompt)
                state.form_prompt = action.payload.prompt;
            state.show_prompt_engineering_form = true;
        },
        closePromptEngineeringForm: (state) => {
            state.show_prompt_engineering_form = false;
            state.form_prompt = '';
        },
        showDeleteCategorizationForm: (state, action) => {
            state.show_delete_form = action.payload.show
            state.edit = action.payload.categorization
        },
        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },

    },
    extraReducers
})

export const {
    showAddCategorizationForm,
    closeCategorizationForm,
    showEditCategorizationForm,
    showDeleteCategorizationForm,
    closeDeleteForm,
    showPromptEngineeringForm,
    closePromptEngineeringForm
} = categorizationSlice.actions;
export default categorizationSlice.reducer;
