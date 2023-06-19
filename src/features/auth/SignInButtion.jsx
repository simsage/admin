import React, {useState} from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";

import "../../css/sign-in.css";
import OpenSourceSoftwareLicenses from "../home/OpenSourceSoftwareLicenses";

function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
    })
}

export const SignInButton = () => {
    const image = "images/simsage-logo-no-strapline.svg";
    const { instance } = useMsal()

    const [show_license, setShowLicense] = useState(false);

    function toggleLicense() {
        setShowLicense(!show_license)
    }

    return (
        <div>
            <div className="spinner">
            </div>
            <div className="logo-box">
                <img alt="SimSage" title="SimSage admin" className="logo" src={image} onClick={() => window.location = "/"} />
            </div>
            <div className="auth-wrapper header-height">
                <div className="auth-inner">

                    <div className="sign-in-title">SimSage admin sign in</div>

                    <span className="form-group sign-in-button" title="admin sign in"
                          onClick={() => { setShowLicense(false); handleLogin(instance) }}>
                        <button className="btn btn-primary">
                            Sign in
                        </button>
                    </span>

                    <p className="forgot-password text-right" title="view the open-source licenses used" onClick={() => toggleLicense()}>
                        <span className="forgot-password-link">open-source licenses</span>
                    </p>

                </div>
            </div>

            {show_license &&
                <OpenSourceSoftwareLicenses/>
            }

        </div>

    );
}
