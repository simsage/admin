import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loadDocumentList} from "../document_management/documentSlice";

const initialState = {
    mind_item_list:[
        {
            "organisationId": "7cc95aa3-e1e2-4596-9347-6bcd7b2234c2",
            "mid": "77e30769-012a-47a2-a819-480e40d55e8d",
            "id": 1,
            "information": "John Malpas",
            "questionList": [
                "who is the editor of GLP "
            ],
            "urlList": [
                "https://www.globallegalpost.com/ "
            ],
            "imageList": [
                "https://pbs.twimg.com/profile_images/646000045158977536/QlTXYmSj_400x400.jpg "
            ],
            "videoList": [],
            "soundList": [],
            "created": 1658506280239
        },
        {
            "organisationId": "7cc95aa3-e1e2-4596-9347-6bcd7b2234c2",
            "mid": "77e30769-012a-47a2-a819-480e40d55e8d",
            "id": 2,
            "information": "You can email us at information@nicholas-scott.com, phone us at: +44 203 475 3192, or visit us at 33 Cannon St, London EC4M 5SB.",
            "questionList": [
                "how do I contact Nicholas Scott "
            ],
            "urlList": [
                "https://www.nicholas-scott.com/contact-us "
            ],
            "imageList": [],
            "videoList": [],
            "soundList": [],
            "created": 1658506280239
        }
    ],
    num_mind_items:0,
    page_size:10,
    mind_item_page:0,
    status: null,

}

const reducers = null

const extraReducers = (builder) => {
    builder
        .addCase(loadMindItems.pending, (state, action) => {
            state.status = "loading"
        })

        .addCase(loadMindItems.fulfilled, (state, action) => {
            console.log("addCase getDocuments fulfilled ", action);
            state.status = "fulfilled";
            state.mind_item_list = action.payload.documentList;
            state.num_mind_items = action.payload.numDocuments;
            // console.log('action.payload', action.payload);
        })
        .addCase(loadMindItems.rejected, (state, action) => {
            console.log("addCase getDocuments rejected ", action)
            state.status = "rejected"
        })
}

const botSlice = createSlice({
    name:"bot",
    initialState,
    reducers,
    extraReducers
})

export const loadMindItems = createAsyncThunk(
    "bot/loadMindItems",
    async ({}) => {

    }
)

export const {} = botSlice.actions
export default botSlice.reducer