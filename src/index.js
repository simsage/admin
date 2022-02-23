import React from 'react';
// import 'babel-polyfill'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter} from 'react-router-dom'
import {Route} from 'react-router'

import configureStore from "./reducers/configureStore";
import {saveState} from "./reducers/stateLoader";
// must not have {} to work
import SignIn from './auth/sign_in'

// import ResetPasswordRequest from './auth/reset_password_request'
// import ResetPasswordResponse from './auth/reset_password_response'
import OpenSourceLicenses from './auth/open_source_licenses'
import LicenseAgreement from "./auth/license_agreement";
import SearchPage from "./search/search-page";

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'typeface-roboto';

import Home from './home'

import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import {PublicClientApplication} from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import {PageLayout} from "./pageLayout";
import SignInError from "./auth/sign_in_error";

require('typeface-roboto')


const store = configureStore();
store.subscribe(() => {
    saveState(store.getState());
});

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
    <Provider store={store}>
        <MsalProvider instance={msalInstance}>
            <HashRouter basename={'/'}>
                <PageLayout>
                    <AuthenticatedTemplate>
                        <div>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/error" component={SignInError} />
                            {/*<Route path="/reset-password-request" component={ResetPasswordRequest} />*/}
                            {/*<Route path="/reset-password-response" component={ResetPasswordResponse} />*/}
                        </div>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <div>
                            <Route exact path="/" component={SignIn} />
                            <Route exact path="/error" component={SignInError} />
                            <Route exact path="/foss-license" component={OpenSourceLicenses} />
                            <Route exact path="/license-agreement" component={LicenseAgreement} />
                            <Route exact path="/search" component={SearchPage} />
                        </div>
                    </UnauthenticatedTemplate>
                </PageLayout>
            </HashRouter>
        </MsalProvider>
    </Provider>,
    document.getElementById('content')
);
