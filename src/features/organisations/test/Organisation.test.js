import { showAddOrganisationForm } from "../organisationSlice";
import organisationReducer from "../organisationSlice";
import {Provider} from 'react-redux'
import {fireEvent, render as rtlRender, screen} from '@testing-library/react'
import {configureStore} from '@reduxjs/toolkit';
import {OrganisationHome} from "../OrganisationHome";
import authReducer from "../../auth/authSlice";


const initial_state = {}

const app_store = configureStore({
    reducer: {
        organisationReducer: organisationReducer,
        authReducer: authReducer
    }
})

const render = (ui, { initialState = initial_state, store = app_store, ...renderOptions } = {}) => {
    const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>
    return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
}


describe("Show / close forms", () => {
    it("Organisation: Form: Show Add ", () => {
        const showForm = ({...initial_state, "show_organisation_form": true});
        expect(organisationReducer(initial_state, showAddOrganisationForm({"show_form": true}))).toEqual(showForm);
        // expect(1).toBe(1);
    });
});


//Component Testing
describe(OrganisationHome, () => {
    it('show add-new-organisation form', () => {
        render(<OrganisationHome/>);

        fireEvent.click(screen.getByTestId('add-new-organisation'));
        expect(app_store.getState().organisationReducer.show_organisation_form).toBe(true)
    });
});