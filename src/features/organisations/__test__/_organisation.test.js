import {getOrganisationList, showAddOrganisationForm} from "../organisationSlice";
import organisationReducer from "../organisationSlice";
import {Provider} from 'react-redux'
import {fireEvent, render as rtlRender, screen} from '@testing-library/react'
import {configureStore} from '@reduxjs/toolkit';
import {OrganisationHome} from "../OrganisationHome";
import authReducer from "../../auth/authSlice";
import OrganisationEdit from "../OraganisationEdit";
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import {fetch_data} from "./_test_data";

const filter = null;
const api_base = 'https://adminux.simsage.ai/api';
const url = 'https://adminux.simsage.ai/api/auth/user/organisations/' + encodeURIComponent(filter);

export const handlers = [
    rest.get(url, (req, res, ctx) => {
        console.log(req.url)
        return res(ctx.json(fetch_data.organisations), ctx.delay(150))
    })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

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
    });
});


//OrganisationEdit Testing
describe(OrganisationHome, () => {
    it('organisation home with no data', () => {
        render(<OrganisationHome/>);
        expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('show add-new-organisation form', () => {
        render(<OrganisationHome/>);
        fireEvent.click(screen.getByTestId('add-new-organisation'));
        expect(app_store.getState().organisationReducer.show_organisation_form).toBe(true)
    });

});