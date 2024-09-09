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
      .addCase(loadTextToSearch.pending, (state, _) => {
          return {
              ...state,
              status: "pending",
              data_status: "loading"
          }
      })
      .addCase(loadTextToSearch.fulfilled, (state, action) => {
          return {
              ...state,
              status: "fulfilled",
              data_status: "loaded",
              text_to_search_list: action.payload.textToSearchList ? action.payload.textToSearchList : [],
              num_of_text_to_search: action.payload.numTextToSearch ? action.payload.numTextToSearch : 0
          }
      })
      .addCase(loadTextToSearch.rejected, (state, action) => {
          return {
              ...state,
              status: "rejected",
              show_error_form: true,
              error_title: "Could Not Load Language Parts",
              error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
          }
      })

    //update data
      .addCase(addOrUpdateTextToSearch.pending, (state, _) => {
          return {
              ...state,
              status: "pending",
              data_status: "loading"
          }
      })
      .addCase(addOrUpdateTextToSearch.fulfilled, (state, _) => {
          return {
              ...state,
              status: "fulfilled",
              data_status: "load_now"
          }
      })
      .addCase(addOrUpdateTextToSearch.rejected, (state, action) => {
          return {
              ...state,
              status: "rejected",
              show_error_form: true,
              error_title: "ERROR",
              error_message: action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
          }
      })

      //deleteRecord
      .addCase(deleteTextToSearch.pending, (state, _) => {
          return {
              ...state,
              status: "loading"
          }
      })
      .addCase(deleteTextToSearch.fulfilled, (state, _) => {
          return {
              status: "fulfilled",
              data_status: 'load_now'
          }
      })
      .addCase(deleteTextToSearch.rejected, (state, action) => {
          return {
              ...state,
              status: "rejected",
              show_error_form: true,
              error_title: "Could Not Delete",
              error_message:
                  action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
          }
      })

      //TestRecord
      .addCase(testTextToSearch.pending, (state, _) => {
          return {
              ...state,
              status: "loading"
          }
      })
      .addCase(testTextToSearch.fulfilled, (state, action) => {
          return {
              ...state,
              status: "fulfilled",
              test_response: action.payload.text ? action.payload.text : ''
          }
      })
      .addCase(testTextToSearch.rejected, (state, action) => {
          return {
              ...state,
              status: "rejected",
              show_error_form: true,
              error_title: "Test Query Failed",
              error_message:
                  action?.payload?.error ?? "Please contact the SimSage Support team if the problem persists"
          }
      })
};

const textToSearchSlice = createSlice({
    name: "textToSearch",
    initialState,
    reducers: {
        showAddForm: (state) => {
            return {
                ...state,
                show_text_to_search_form: true
            }
        },
        showEditForm: (state, action) => {
            return {
                ...state,
                show_text_to_search_form: true,
                edit: action.payload
            }
        },
        closeEditForm: (state) => {
            return {
                ...state,
                show_text_to_search_form: false,
                edit: undefined,
                show_error_form: false,
                error: ''
            }
        },
        showDeleteForm: (state, action) => {
            return {
                ...state,
                show_delete_form: true,
                edit: action.payload
            }
        },

        closeDeleteForm: (state) => {
            return {
                ...state,
                show_delete_form: false,
                edit: undefined
            }
        },
        showTestForm: (state) => {
            return {
                ...state,
                show_test_form: true
            }
        },
        closeTestForm: (state) => {
            return {
                ...state,
                show_test_form: false
            }
        },
        closeErrorMessage: (state, _) => {
            return {
                ...state,
                show_error_form: false,
                error_message: undefined,
                error_title: undefined
            }
        },
    },
  },
  extraReducers
);

export const {
    closeErrorMessage,
    showAddForm,
    showEditForm,
    closeEditForm,
    showDeleteForm,
    closeDeleteForm,
    showTestForm,
    closeTestForm
} = textToSearchSlice.actions;

export default textToSearchSlice.reducer;