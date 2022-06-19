import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./features/auth/authConfig";


// todo:: need to merge some style sheets
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import 'typeface-roboto';
// import './css/admin-page.css';
import './css/main.css';
// import './css/layout/navbar.css';
// import './css/layout/left-sidebar.css';
// import './css/sign-in.css';
// import './css/app-menu.css';
import {saveState} from "./utilities/helpers";
import Comms from "./utilities/comms";

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

