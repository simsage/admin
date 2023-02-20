import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";


const initialState = {
  text_to_search_list: [],
  num_of_text_to_search: 0,
  status: true,
  data_status: 'load_now',
  show_tts_form: undefined,
};

export const loadTextToSearch = createAsyncThunk( "TextToSearch/load",
    async ({ session_id, data}) => {
    console.log('running')
    console.log(data)
    const api_base = window.ENV.api_base;
    const url = api_base + '/semantic/text-to-search';

    return axios.put( url, data, Comms.getHeaders(session_id))
        .then((response) => {
          return response.data
        }).catch(
            (error) => {
              return error
            }
        )
})

const extraReducers = (builder) => {
  builder
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
      })
};

const textToSearchSlice = createSlice({
  name: "textToSearch",
  initialState,
  reducers: {
    showAddTTSForm:(state) => {
      state.show_tts_form = true
    },
  },
  extraReducers
});

export const {showAddTTSForm} = textToSearchSlice.actions;
export default textToSearchSlice.reducer;