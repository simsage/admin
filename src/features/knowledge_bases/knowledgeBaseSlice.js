import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import Comms from "../../common/comms";
import db_users from "../../notes/db.json";

const initialState = {
    kb_list: db_users.db_kb,
    kb_filter: '',
    kb_page: 0,
    kb_page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_kb_form: false,
}


const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddKnowledgeBaseForm:(state,action) => {
            state.show_kb_form = action.payload
        }
    }
});



export const { showAddKnowledgeBaseForm } = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;