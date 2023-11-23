import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';

import { PublicClientApplication } from "@azure/msal-browser";
import {AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate} from "@azure/msal-react";
import { msalConfig } from "./features/auth/authConfig";

import { store } from './app/store';

// todo:: need to merge some style sheets
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'typeface-roboto';
import './css/main.css';
import {SignInButton} from "./features/auth/SignInButton";
import PasswordSignIn from "./auth/password_sign_in";


const msalInstance = new PublicClientApplication(msalConfig);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            { window.ENV.authentication === "password" &&
                <PasswordSignIn />
            }
            { window.ENV.authentication !== "password" &&
                <MsalProvider instance={msalInstance}>
                    <AuthenticatedTemplate>
                        <App/>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <SignInButton />
                    </UnauthenticatedTemplate>
                </MsalProvider>
            }
        </Provider>
    </React.StrictMode>
);
