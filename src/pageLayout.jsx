/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";

import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";

import './css/sign-in.css';
import './css/app-menu.css';
import {clearState} from "./reducers/stateLoader";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const theme = "light";
    const image = "../images/simsage-logo-no-strapline.svg";
    const { instance } = useMsal();

    return (
        <div className={"app-menu menu-padding no-select"}>
            <div className="logo-box">
                <img alt="SimSage" title="Search less; find more." className="logo" src={image} onClick={() => {}} />
            </div>
            {
                !isAuthenticated &&
                <span className="home-image-container">
                    <img src={theme === 'light' ? "../images/home.svg" : "../images/home-light.svg"} alt="home"
                         title="home" onClick={() => {
                    }}
                         className="home-image"/>
                     <div className="version-text">version {window.ENV.version}</div>
                </span>
            }
            <div>
                {
                    !isAuthenticated &&
                    <div>
                        <div className="spinner">
                        </div>

                        <div className="auth-wrapper">
                            <div className="auth-inner" style={{"backgroundColor": "#f0f0f080"}}>
                                <h3>SimSage Mind sign in</h3>

                                <div className="form-group spacer-height">
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-block" onClick={() => {
                                        // clear any existing state
                                        clearState();
                                        // sign in and re-direct
                                        instance.loginRedirect(loginRequest).catch(e => {
                                            console.error(e);
                                        });
                                    }}>Sign in using Azure</button>
                                </div>

                                <p className="forgot-password text-right">
                                    <span className="forgot-password-link" onClick={() => window.location = '/#/foss-license'}>open-source licenses</span>
                                </p>
                            </div>
                        </div>

                    </div>
                }
                {
                    isAuthenticated &&
                    <div className="sign-out-image-container">
                        <img src={theme === 'light' ? "../images/sign-out.svg" : "../images/sign-out-light.svg"} alt="sign-out" title="sign-out"
                             onClick={() => {
                                 instance.logoutRedirect({
                                     postLogoutRedirectUri: "/",
                                 });
                             }} className="sign-out-image" />
                    </div>
                }

            </div>

            <br clear="both" />
            <br clear="both" />

            {props.children}

        </div>
    );
};
