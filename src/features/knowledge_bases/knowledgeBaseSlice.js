import {createSlice} from "@reduxjs/toolkit";
import Comms from "../../utilities/comms";

const initialState = {
    list: [],
    filter: '',
    page: 0,
    page_size: 10,

    //new states
    status: 'idle',
    error: null,
    show_knowledge_base_form: false,
}


const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBases',
    initialState,
    reducers: {
        showAddKnowledgeBaseForm:(state,action) => {
            state.show_knowledge_base_form = action.payload
        }
    }
});


export const { showAddKnowledgeBaseForm } = knowledgeBaseSlice.actions
export default knowledgeBaseSlice.reducer;