import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'

import { SignIn } from './auth/sign_in'
import { ResetPasswordRequest } from './auth/reset_password_request'
import { ResetPasswordResponse } from './auth/reset_password_response'
import { OpenSourceLicenses } from './auth/open_source_licenses'
import { LicenseAgreement } from "./auth/license_agreement";

import { Home } from './kb/home'


export const sessionReducer = (state = {}) => {
    return state;
};

export let store = createStore(
    sessionReducer
);

ReactDOM.render(
    <Provider store={store}>
    <div>
        <HashRouter basename={'/'}>
            <div>
                <Route exact path="/" component={SignIn} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/sign-in" component={SignIn} />
                {/*<Route exact path="/register" component={Register} />*/}
                <Route path="/reset-password-request" component={ResetPasswordRequest} />
                <Route path="/reset-password-response" component={ResetPasswordResponse} />
                <Route exact path="/os-license" component={OpenSourceLicenses} />
                <Route exact path="/license-agreement" component={LicenseAgreement} />
            </div>
        </HashRouter>
    </div>
    </Provider>,
    document.getElementById('content')
);
