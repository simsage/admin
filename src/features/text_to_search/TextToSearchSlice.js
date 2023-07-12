import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";


const initialState = {
    text_to_search_list: [],
    num_of_text_to_search: 0,
    page_size: 10,
    page: 0,
    status: true,
    data_status: 'load_now',
    show_text_to_search_form: false,
    show_test_form: false,
    test_response: undefined,
    show_delete_form: false,
    edit: undefined,
    show_error_form: false,
    error: ''
};


export const loadTextToSearch = createAsyncThunk( "TextToSearch/load",
    async ({ session_id, data}, {rejectWithValue}) => {
    const api_base = window.ENV.api_base;
    const url = api_base + '/semantic/text-to-search';

    return axios.put( url, data, Comms.getHeaders(session_id))
        .then((response) => {
          return response.data
        }).catch((err) => {
            return rejectWithValue(err?.response?.data)
        })
})

export const addOrUpdateTextToSearch = createAsyncThunk( "TextToSearch/update",
    async({session_id, organisation_id, kb_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/semantic/text-to-search/${encodeURIComponent(organisation_id)}/${encodeURIComponent(kb_id)}`

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


export const deleteTextToSearch = createAsyncThunk( "TextToSearch/delete",
    async({session_id, organisation_id, kb_id, word}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/semantic/text-to-search/${encodeURIComponent(organisation_id)}/${encodeURIComponent(kb_id)}/${encodeURIComponent(word)}`

        return axios.delete(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch((err) => {
                return rejectWithValue(err?.response?.data)
            })
    })


export const testTextToSearch = createAsyncThunk( "TextToSearch/Test",
        async({session_id, data}, {rejectWithValue}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/semantic/text-to-search-try`

            return axios.put(url, data, Comms.getHeaders(session_id))
                .then((response) => {
                    return response.data
                }).catch((err) => {
                    return rejectWithValue(err?.response?.data)
                })
        })

const extraReducers = (builder) => {
  builder
      //Load data
      .addCase(loadTextToSearch.pending, (state, action) => {
        state.status = "pending";
        state.data_status = "loading";
      })
      .addCase(loadTextToSearch.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data_status = "loaded";
        state.text_to_search_list = action.payload.textToSearchList ? action.payload.textToSearchList : [];
        state.num_of_text_to_search = action.payload.numTextToSearch ? action.payload.numTextToSearch : 0;
      })
      .addCase(loadTextToSearch.rejected, (state, action) => {
        state.status = "rejected"
          state.show_error_form = true
          state.error_title = "Could Not Load Language Parts"
          state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
      })

    //update data
      .addCase(addOrUpdateTextToSearch.pending, (state, action) => {
          state.status = "pending";
          state.data_status = "loading";
      })
      .addCase(addOrUpdateTextToSearch.fulfilled, (state, action) => {
          state.status = "fulfilled";
          state.data_status = "load_now";})
      .addCase(addOrUpdateTextToSearch.rejected, (state, action) => {
          state.status = "rejected"
          state.show_error_form = true
          state.error_title = "ERROR"
          state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
      })

      //deleteRecord
      .addCase(deleteTextToSearch.pending, (state, action) => {
          state.status = "loading"
      })
      .addCase(deleteTextToSearch.fulfilled, (state, action) => {
          state.status = "fulfilled"
          state.data_status = 'load_now';
      })
      .addCase(deleteTextToSearch.rejected, (state, action) => {
          state.status = "rejected"
          state.show_error_form = true
          state.error_title = "Could Not Delete"
          state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
      })

      //TestRecord
      .addCase(testTextToSearch.pending, (state, action) => {
          state.status = "loading"
      })
      .addCase(testTextToSearch.fulfilled, (state, action) => {
          state.status = "fulfilled"
          state.test_response = action.payload.text ? action.payload.text : ''
      })
      .addCase(testTextToSearch.rejected, (state, action) => {
          state.status = "rejected"
          state.show_error_form = true
          state.error_title = "Test Query Failed"
          state.error_message = action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
      })
};

const textToSearchSlice = createSlice({
    name: "textToSearch",
    initialState,
    reducers: {
        showAddForm: (state) => {
            state.show_text_to_search_form = true
        },
        showEditForm: (state, action) => {
            state.show_text_to_search_form = true;
            state.edit = action.payload;
        },
        closeEditForm: (state) => {
            state.show_text_to_search_form = false;
            state.edit = undefined;
            state.show_error_form = false;
            state.error = '';
        },
        showDeleteForm: (state, action) => {
            state.show_delete_form = true;
            state.edit = action.payload;
        },

        closeDeleteForm: (state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        showTestForm: (state) => {
            state.show_test_form = true;
        },
        closeTestForm: (state) => {
            state.show_test_form = false;
        },
        closeErrorMessage: (state, action) => {
            state.show_error_form = false;
            state.error_message = undefined;
            state.error_title = undefined;
        },
    },
  },
  extraReducers
);

export const {closeErrorMessage, showAddForm, showEditForm, closeEditForm, showDeleteForm, closeDeleteForm, showTestForm, closeTestForm} = textToSearchSlice.actions;

export default textToSearchSlice.reducer;