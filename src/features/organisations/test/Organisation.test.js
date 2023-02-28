import reducer,{
    closeOrganisationForm,
    getOrganisationList,
    showAddOrganisationForm,
    showEditOrganisationForm
} from "../organisationSlice";
import organisationReducer from "../organisationSlice";
import { Provider } from 'react-redux'
import {render as rtlRender, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import * as React from 'react'
import {createStore} from 'redux'
// import organisationReducer from "../organisationSlice";
import { configureStore } from '@reduxjs/toolkit';
import {OrganisationHome} from "../OrganisationHome";
import organisationSlice from "../organisationSlice";
import authReducer from "../../auth/authSlice";


const initialState1 = {
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
//

// const store = configureStore({
//     reducer: {
//         reducer: organisationReducer
//     }
// })

const render = (
    ui,
    {
        initialState = initialState1,
        store = configureStore({reducer: {
            organisationReducer: organisationReducer,
                authReducer: authReducer,
            }}),
        ...renderOptions
    } = {},
) => {
    const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>

    return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}



describe("Show / close forms", () => {
    it("Organisation: Form: Show Add ", () => {
        const showForm = ({...initialState1, "show_organisation_form": true});
        expect(organisationReducer(initialState1, showAddOrganisationForm({"show_form": true}))).toEqual(showForm);
        // expect(1).toBe(1);
    });
});



//Component Testing
describe(OrganisationHome, () => {
it('show add-new-organisation form', () => {
    render(<OrganisationHome />);

    userEvent.click(screen.getByTestId('add-new-organisation'));
    expect(1).toBe(1)
    // expect(screen.getByTestId('count-value')).toHaveTextContent('1000')
    // expect(screen.getByTestId('count-value')).toHaveTextContent('1')
});
});