import {
    closeOrganisationForm,
    getOrganisationList,
    showAddOrganisationForm,
    showEditOrganisationForm
} from "../organisationSlice";

import organisationReducer from "../organisationSlice";


import {configureStore} from "@reduxjs/toolkit";
import MockAdapter from "axios-mock-adapter";
import axios from "axios/index";
import {fetch_data} from "./TestData";

const initialState = {
    organisation_filter: null,
    organisation_list: {},
    organisation_page: 0,
    organisation_page_size: 10,

    //new states
    status: null,
    error: null,
    show_organisation_form: false,
    edit_organisation_id: null,
    load_data: false,
}

let mock;
const api_base = 'https://uat-cloud.simsage.ai/api';
const session = {id: "1232"}

const store = configureStore({
    reducer: {
        reducer: organisationReducer
    }
})



describe("Show / close forms", () => {
    it("Organisation: Form: Show Add ", () => {
        const showForm = ({...initialState, "show_organisation_form": true});
        expect(organisationReducer(initialState, showAddOrganisationForm({"show_form": true}))).toEqual(showForm);
    });

    it("Organisation: Form: Show Edit", () => {
        const t_org_id = "1234";
        const editForm = ({...initialState, "show_organisation_form": true, "edit_organisation_id": t_org_id});
        expect(organisationReducer(initialState, showEditOrganisationForm({
            "show_form": true,
            "org_id": t_org_id
        }))).toEqual(editForm);
    });

    it("Organisation: Form: Close Add/Edit", () => {
        expect(organisationReducer(initialState, closeOrganisationForm())).toEqual(initialState);
    });


    it("getOrganisationList.fulfilled", () => {
        const action = {type: getOrganisationList.fulfilled.type, payload: fetch_data.organisations}
        const state = organisationReducer(initialState,action);
        expect(state.status).toEqual("fulfilled");
        expect(state.organisation_list).toEqual(fetch_data.organisations);
    });

    it("getOrganisationList.pending", () => {
        const action = {type: getOrganisationList.pending.type, payload: fetch_data.organisations}
        const state = organisationReducer(initialState,action);
        expect(state.status).toEqual("loading");
    });

    it("getOrganisationList.rejected", () => {
        const action = {type: getOrganisationList.rejected.type, payload: fetch_data.organisations}
        const state = organisationReducer(initialState,action);
        expect(state.status).toEqual("rejected");
    });



});


// mock = new MockAdapter(axios)
// const orgs = fetch_data.organisations;
//
// const mockNetWorkResponse = () =>{
//     mock.onGet(api_base+"/auth/user/organisations/").reply(200,fetch_data.organisations);
// }

// describe("getOrganisationList", () => {
//
//     beforeAll(()=>{
//         mockNetWorkResponse();
//     })
//
//     it("when API call is successful", () => {
//
//             store.dispatch(getOrganisationListTest({session:session.id, filter:null}))
//
//             const state = store.getState().reducer;
//             console.log(state)
//             // const organisation_list = store.getState().reducer.organisation_list;
//             // axios.get(api_base+"/auth/user/organisations/").then((res) => {
//             //     console.log("res",res.data)
//             // })
//             // console.log("result",result)
//             // console.log("when API call is successful")
//             // console.log("when API call is successful",store.getState().reducer)
//
//             // expect(organisation_list).toEqual(fetch_data.organisations)
//     })
//     it("it should return empty org list", () => {
//
//     });
// });
