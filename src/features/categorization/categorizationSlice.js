import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import Comms from "../../common/comms";

const initialState = {
    status: null,
    category_list:[],
    data_status: "load_now",
    show_category_form: false,
    show_delete_form: false,
    category: undefined,
    error:undefined,
    show_error: false,
    page_size: 10,
    page: 0,
    total_count:0,
}

export const loadCategorizations = createAsyncThunk("categorization/loadCategorizations",
    async ({session_id, organisation_id, kb_id, prevCategorizationLabel, pageSize}) => {

        const api_base = window.ENV.api_base;
        //https://adminux.simsage.ai/api/language/categorization/c276f883-e0c8-43ae-9119-df8b7df9c574/0185c075-31ea-23d7-ec8d-a573738bcd0b/null/5
        const url = api_base + '/language/categorization/' + encodeURIComponent(organisation_id) +'/'+ encodeURIComponent(kb_id)+'/'+ encodeURIComponent(prevCategorizationLabel)+'/'+encodeURIComponent(pageSize);

        return axios.get(url, Comms.getHeaders(session_id))
            .then((response) => {
                return response.data
            })
            .catch(
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
                return response;
            })
    }
)



export const deleteCategorization = createAsyncThunk(
        "categorization/deleteCategorization",
            async({session_id, organisation_id, knowledge_base_id, categorizationLabel}) => {

            const api_base = window.ENV.api_base;
            const url = api_base + `/language/categorization/${encodeURIComponent(organisation_id)}/${encodeURIComponent(knowledge_base_id)}/${encodeURIComponent(categorizationLabel)}`;

            return axios.delete(url, Comms.getHeaders(session_id))
                .then((response) => {
                    return response.data.error;
                })
                .catch(
                    (error) => {return error}
                )
            }
)

const extraReducers = (builder) => {
    builder


        .addCase(loadCategorizations.pending,(state) => {
            state.status = "pending";
            state.data_status = "loading";
        })
        .addCase(loadCategorizations.fulfilled,(state, action) => {
            state.status = "fulfilled"
            state.category_list = action.payload.categorizationList
            // state.category_list = action.payload
            state.total_count = action.payload.totalCategorizationCount
            // state.data_status = "loaded";
        })
        .addCase(loadCategorizations.rejected,(state) => {
            state.status = "rejected";
            state.data_status = "rejected";
        })


        //updates
        .addCase(updateCategorization.pending,(state) => {
            state.status = "pending";
            state.data_status = "loading";
        })
        .addCase(updateCategorization.fulfilled,(state) => {
            state.status = "fulfilled"
            state.data_status = "load_now";
            state.show_category_form = false;
            state.edit = undefined;

        })
        .addCase(updateCategorization.rejected,(state, action) => {
            state.status = "rejected";
            state.data_status = "rejected";
            state.error = action.error.message
            state.show_error = true;
        })


    //Delete
        .addCase(deleteCategorization.pending,(state) => {
            state.status = "pending";
            state.data_status = "loading";
        })
        .addCase(deleteCategorization.fulfilled,(state) => {
            state.status = "fulfilled"
            state.data_status = "load_now";
        })
        .addCase(deleteCategorization.rejected,(state) => {
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
            state.edit = undefined;
        },
        showEditCategoryForm:(state, action) => {
            state.show_category_form = action.payload.show;
            state.edit = action.payload.category;
        },
        closeCategoryForm:(state) => {
            state.show_category_form = false;
            state.edit = undefined;
        },
        showDeleteCategorizationForm:(state, action) => {
            state.show_delete_form = action.payload.show
            state.edit = action.payload.category
        },
        closeDeleteForm:(state) => {
            state.show_delete_form = false;
            state.edit = undefined;
        },
        closeErrorForm:(state) => {
            state.error = undefined;
            state.show_error = false;
        }
    },
    extraReducers
})



export const {showAddCategoryForm, showEditCategoryForm, closeCategoryForm, showDeleteCategorizationForm, closeDeleteForm, closeErrorForm } = categorizationSlice.actions;
export default categorizationSlice.reducer;
