import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db from "../../notes/db.json"
import axios from "axios";
// import {updateOrganisation} from "../organisations/organisationSlice";

const initialState = {
    source_list: [],
    source_filter: null,
    source_page: 0,
    source_page_size: 10,

    selected_source: null,
    selected_source_id: null,
    data_status: 'load_now',//load_now,loading,loaded

    status: null,
    error: '',

    // data form
    show_data_form: false,

    //start_crawler warning
    show_start_crawler_form: false,

    //selected source tab
    selected_source_tab: null,
    //selected source type in form
    selected_source_type: null,

}

const reducers = {
    showAddForm:(state) => {
        state.show_data_form = true
    },

    showEditForm:(state,action) => {
        state.show_data_form = true
        state.selected_source = action.payload.source
        state.selected_source_id = action.payload.source.sourceId
    },

    closeForm:(state) => {
        console.log("closeForm sourceSlice")
        state.show_data_form = false;
        state.selected_source = null;
    },

    setSelectedSourceTab:(state,action) => {
        state.selected_source_tab = action.payload
    },

    setSelectedSourceType:(state,action) => {
        state.selected_source_type = action.payload
    },
}

const extraReducers = (builder) => {
    builder
        .addCase(getSources.pending, (state, action) => {
            state.status = "loading"
            state.data_status = 'loading'
        })
        .addCase(getSources.fulfilled, (state, action) => {
            state.status = "fulfilled"
            state.source_list = action.payload
            state.data_status = 'loaded';
        })
        .addCase(getSources.rejected, (state, action) => {
            state.status = "rejected"
            state.data_status = "rejected"
        })

        //
        // .addCase(getSource.pending, (state, action) => {
        //     state.status = "loading"
        //     state.data_status = 'loading'
        // })
        // .addCase(getSource.fulfilled, (state, action) => {
        //     state.status = "fulfilled"
        //     state.selected_source = action.payload
        //     state.data_status = 'loaded';
        // })
        // .addCase(getSource.rejected, (state, action) => {
        //     state.status = "rejected"
        //     state.data_status = "rejected"
        // })


        .addCase(updateSources.fulfilled, (state, action) => {
            console.log("updateSources fulfilled ",action)
            state.show_data_form = false;
            state.selected_source = null;
            state.data_status = 'load_now';
        })

        .addCase(updateSources.rejected, (state, action) => {
            console.log("updateSources rejected ", action)
            state.data_status = 'load_now';
        })



}


export const getSources = createAsyncThunk(
    'sources/getSources',
    async ({session_id, organisation_id, kb_id}) => {
        const api_base = window.ENV.api_base;
        const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);

        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }
        return axios.get(api_base + url, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("sources/getSources",response.data);
                return response.data
            }).catch(
                (error) => {return error}
            )
    }
);


// export const getSource = createAsyncThunk(
//     'sources/getSource',
//     async ({session_id, organisation_id, kb_id,source_id}) => {
//         const api_base = window.ENV.api_base;
//         const url = '/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id)+ '/' + encodeURIComponent(source_id);
//
//         if (url !== '/stats/stats/os') {
//             console.log('GET ' + api_base + url);
//         }
//         return axios.get(api_base + url, Comms.getHeaders(session_id))
//             .then((response) => {
//                 console.log("sources/getSource",response.data);
//                 return response.data
//             }).catch(
//                 (error) => {return error}
//             )
//     }
// );



// https://uat.simsage.ai/api/crawler/crawler
// POST
export const updateSources = createAsyncThunk(
    'sources/updateSources',
    async ({session_id,data}) => {

        console.log("sources/updateSources");

        const api_base = window.ENV.api_base;
        const url = api_base + '/crawler/crawler/';

        if (url !== '/stats/stats/os') {
            console.log('POST ' + url);
        }
        return axios.post(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                console.log("updateSources data",response.data)
                return response.data
            }).catch(
                (error) => {
                    console.log("error",error)
                    return error
                }
            )

});

// updateCrawler: (crawler) => async (dispatch, getState) => {
//     dispatch({type: BUSY, busy: true});
//     const organisation_id = getState().appReducer.selected_organisation_id;
//     const kb_id = getState().appReducer.selected_knowledgebase_id;
//     const session_id = get_session_id(getState);
//     await Comms.http_post('/crawler/crawler', session_id, crawler,
//         () => {
//             _getCrawlers(organisation_id, kb_id, dispatch, getState)
//         },
//         (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
//     )
// },


const sourceSlice = createSlice({
    name: 'sources',
    initialState,
    reducers,
    extraReducers
});

export const { showAddForm, showEditForm, closeForm, setSelectedSourceTab, setSelectedSourceType  } = sourceSlice.actions
export default sourceSlice.reducer;