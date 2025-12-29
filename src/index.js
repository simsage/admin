import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './app/store';
import {AuthProvider} from 'react-oidc-context'
import { WebStorageStateStore } from 'oidc-client-ts';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'typeface-roboto';
import './css/main.css';
import {Provider} from "react-redux";
import App from "./App";
import {AutomaticLogin, OIDC_REDIRECT_STORAGE_KEY} from "./AutomaticLogin";
import {SessionManager} from "./SessionManager";
import {BrowserRouter} from "react-router-dom";

const oidcConfig = {
    authority: window.ENV.kc_endpoint + '/realms/' + window.ENV.kc_realm,
    client_id: window.ENV.kc_client_id,
    redirect_uri: window.location.origin + window.ENV.base_name,
    response_type: 'code',
    scope: 'openid profile email offline_access',
    automaticSilentRenew: false,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    onSigninCallback: (user) => {
        const stored_search = sessionStorage.getItem(OIDC_REDIRECT_STORAGE_KEY)
        sessionStorage.removeItem(OIDC_REDIRECT_STORAGE_KEY);
        let new_url = window.location.pathname + (stored_search || '');
        window.history.replaceState({}, document.title, new_url);
    },
}

const container = document.getElementById('root');
const root = createRoot(container);



root.render(
    <AuthProvider {...oidcConfig}>
        <AutomaticLogin>
            <Provider store={store}>
                <SessionManager>
                    <BrowserRouter basename={window.ENV.base_name}>
                        <App/>
                    </BrowserRouter>
                </SessionManager>
            </Provider>
        </AutomaticLogin>
    </AuthProvider>
)
