import reducer,{showAddForm, showEditForm, closeForm} from '../inventorySlice'
import inventoryReducer from "../inventorySlice";
import MockAdapter from "axios-mock-adapter";
import axios from "axios/index";
import {parquets} from "../../sources/test/TestData";
import {configureStore} from "@reduxjs/toolkit";
import inventorySlice from "../inventorySlice";



const store = configureStore({reducer:{inventoryReducer:inventorySlice}})
const previousState = {
    inventory_list: [],
    inventor_busy: false,
    status: null,
    error: null,
    show_form: false,
    edit_id: null,
    view_id: null,
    selected_inventory:{}
}

describe("Inventory Reducer testing", () => {
    it("should return initial state", () => {
        expect(reducer(undefined, {type: undefined})).toEqual(previousState)
    })
    it("should show form", () => {
        const addFormState = {
            inventory_list: [],
            inventor_busy: false,
            status: null,
            error: null,
            show_form: true,
            edit_id: null,
            view_id: null,
            selected_inventory:{}
        }
        expect(reducer(previousState, showAddForm())).toEqual(addFormState)

    })

    it("should show edit form", () => {
        const editFormState = {
            inventory_list: [],
            inventor_busy: false,
            status: null,
            error: null,
            show_form: true,
            edit_id: "1234",
            view_id: null,
            selected_inventory: { "selected_inventory": "true"}
        }
        expect(reducer(previousState, showEditForm({edit_id:"1234",selected_inventory:{selected_inventory:"true"}}))).toEqual(editFormState)
    })


    it("should close form", () => {
        expect(reducer(previousState, closeForm())).toEqual(previousState)
    })

})

describe("Testing Inventory extra reducer", () => {
    it("shout get inventories", async () => {
        const inventory = store.getState().inventoryReducer
        expect(inventory).toEqual( {
            "edit_id": null,
            "error": null,
            "inventor_busy": false,
            "inventory_list": [],
            "selected_inventory": {},
            "show_form": false,
            "status": null,
            "view_id": null})
    })
})

const mock = new MockAdapter(axios)
const organisationId = "018210f0-a3c2-86ae-0a30-f293d2d099a4";
mock.onGet(`/api/document/inventorize/${organisationId}`)
    .reply(200, [])

// const mockNetworkResponse = () => {
//     const mock = new MockAdapter(apiClient.getClient())
//     mock.onGet(`/games/list/?user_id=${userId}`).reply(200, getListResponse)
// }

mock.onGet("https://cloud.simsage.ai/api/document/parquets/7cc95aa3-e1e2-4596-9347-6bcd7b2234c2/77e30769-012a-47a2-a819-480e40d55e8d/0/10")
    .reply(200, parquets);

