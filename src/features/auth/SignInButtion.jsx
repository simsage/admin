import React, {useState} from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";
import {Button} from "bootstrap";

import "../../css/sign-in.css";
import OpenSourceSoftwareLicenses from "../home/OpenSourceSoftwareLicenses";


function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.error(e)
    })
}

export const SignInButton = () => {
    const image = "../images/simsage-logo-no-strapline.svg";
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
                <img alt="SimSage" title="Search less; find more." className="logo" src={image} onClick={() => {}} />
            </div>
            <div className="auth-wrapper header-height">
                <div className="auth-inner">

                    <div className="sign-in-title">SimSage Mind sign in</div>

                    <span className="form-group sign-in-button" title="Sign into the SimSage mind">
                        <button className="btn btn-primary" onClick={() => { setShowLicense(false); handleLogin(instance) }}>
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
