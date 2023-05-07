import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./features/auth/authConfig";

import {saveState} from "./common/helpers";
import { store } from './app/store';

// todo:: need to merge some style sheets
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'typeface-roboto';
import './css/main.css';


const msalInstance = new PublicClientApplication(msalConfig);

const container = document.getElementById('root');
const root = createRoot(container);

store.subscribe(() => {
    saveState(store.getState());
});


root.render(
  <React.StrictMode>
      <MsalProvider instance={msalInstance}>
          <Provider store={store}>
              <App />
          </Provider>
      </MsalProvider>
  </React.StrictMode>
);

