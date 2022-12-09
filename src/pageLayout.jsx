/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";

import {useIsAuthenticated, useMsal} from "@azure/msal-react";

import './css/sign-in.css';
import './css/app-menu.css';

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
            <div>
                {isAuthenticated &&
                    <div className="logo-box">
                        <img alt="SimSage" title="Search Reimagined" className="logo" src={image} onClick={() => {
                            window.location = "/";
                        }}/>
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
