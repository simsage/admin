import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    inventory_list: [],
    inventor_busy: false,
    status: null,
    error: null,
    show_form: false,
    edit_id: null,
    view_id: null,
    selected_inventory:{}
};
const reducers = {
    showAddForm(state) {
        state.show_form = true
    },

    showEditForm(state,action) {
        state.show_form = true
        state.edit_id = action.payload.edit_id
        state.selected_inventory = action.payload.selected_inventory
    },

    closeForm(state) {
        state.show_form = false
        state.edit_id = null
        state.selected_inventory = {}
    }


};

const extraReducers = (builder) => {

}

const inventorySlice = createSlice({
    name: 'inventories',
    initialState,
    reducers,
    extraReducers
});



export const {showAddForm, showEditForm, closeForm} = inventorySlice.actions;
export default inventorySlice.reducer;

