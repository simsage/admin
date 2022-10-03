import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    status: null,
    category_list:[],
    data_status: "load_now",
    show_category_form: false,
    category: undefined,
}

export const loadCategorizations = createAsyncThunk("categorization/loadCategorizations",
    async ({session_id, organisation_id, kb_id}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + '/language/categorization/' + encodeURIComponent(organisation_id) +'/'+ encodeURIComponent(kb_id);

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            }).catch(
                (error) => {
                    return error
                }
            )
    }
);

export const updateCategorization = createAsyncThunk(
    "categorization/updateCategorization",
    async({session_id, data}) => {

        const api_base = window.ENV.api_base;
        const url = api_base + `/language/categorization`;

        return axios.put(url, data, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data;
            }).catch(
                (error) => {return error}
            )
    }
)

const extraReducers = (builder) => {
    builder
        .addCase(loadCategorizations.pending,(state, action) => {
            state.status = "pending";
            state.data_status = "loading";
        })
        .addCase(loadCategorizations.fulfilled,(state, action) => {
            state.status = "fulfilled"
            state.category_list = action.payload
            state.data_status = "loaded";
        })
        .addCase(loadCategorizations.rejected,(state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })
        //updates
        .addCase(updateCategorization.pending,(state, action) => {
            state.status = "pending";
            state.data_status = "loading";
        })
        .addCase(updateCategorization.fulfilled,(state, action) => {
            state.status = "fulfilled"
            state.category_list = action.payload
            state.data_status = "loaded";
        })
        .addCase(updateCategorization.rejected,(state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })
}

const categorizationSlice = createSlice({
    name:"categorization",
    initialState,
    reducers: {
        showAddCategoryForm:(state, action) => {
            state.show_category_form = action.payload;
        },
        showEditCategoryForm:(state, action) => {
            state.show_category_form = action.payload.show;
            state.edit = action.payload.category;
        },
        closeCategoryForm:(state,action) => {
            state.show_category_form = false;
            state.edit = undefined;
        }
    },
    extraReducers
})



export const {showAddCategoryForm, showEditCategoryForm, closeCategoryForm} = categorizationSlice.actions;
export default categorizationSlice.reducer;
