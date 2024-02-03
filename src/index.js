import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from './app/store';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'typeface-roboto';
import './css/main.css';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from "./keycloak";
import {Provider} from "react-redux";
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);

let token = localStorage.getItem('token');
let refreshToken = localStorage.getItem('refreshToken');

const setTokens = (token, idToken, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('idToken', idToken);
}

const eventLogger = (event, error) => {
    if (error) {
        console.log('onKeycloakEvent', event, error)
        keycloak.login()
            .then(() => {
                console.log("keycloak signed in")
            })
    } else {
        console.log('onKeycloakEvent', event)
    }
}

const tokenLogger = (tokens) => {
    if (tokens && tokens.token && tokens.refreshToken) {
        setTokens(tokens.token, tokens.idToken, tokens.refreshToken)
    }
}

let init_options = {onLoad: 'check-sso'};
if (token && refreshToken) {
    init_options = {onLoad: 'check-sso', token: token, refreshToken: refreshToken};
}

root.render(
    <ReactKeycloakProvider
        authClient={keycloak}
        onEvent={eventLogger}
        onTokens={tokenLogger}
        initOptions={init_options}>
        <Provider store={store}>
            <App/>
        </Provider>
    </ReactKeycloakProvider>
)
