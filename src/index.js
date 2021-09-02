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

import ResetPasswordRequest from './auth/reset_password_request'
import ResetPasswordResponse from './auth/reset_password_response'
import OpenSourceLicenses from './auth/open_source_licenses'
import LicenseAgreement from "./auth/license_agreement";
import SearchPage from "./search/search-page";

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'typeface-roboto';

import Home from './home'

require('typeface-roboto')


const store = configureStore();
store.subscribe(() => {
    saveState(store.getState());
});


ReactDOM.render(
    <Provider store={store}>
    <div>
        <HashRouter basename={'/'}>
            <div>
                <Route exact path="/" component={SignIn} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/search" component={SearchPage} />
                <Route path="/reset-password-request" component={ResetPasswordRequest} />
                <Route path="/reset-password-response" component={ResetPasswordResponse} />
                <Route exact path="/foss-license" component={OpenSourceLicenses} />
                <Route exact path="/license-agreement" component={LicenseAgreement} />
            </div>
        </HashRouter>
    </div>
    </Provider>,
    document.getElementById('content')
);
