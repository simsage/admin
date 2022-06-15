import React from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";
import {Button} from "bootstrap";

function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.error(e)
    })
}

export const SignInButton = () => {
    const image = "../images/simsage-logo-no-strapline.svg";
    const { instance } = useMsal()

    return (
        <div>
            <div className="spinner">
            </div>
            <div className="logo-box">
                <img alt="SimSage" title="Search less; find more." className="logo" src={image} onClick={() => {}} />
            </div>
            <div className="auth-wrapper">
                <div className="auth-inner" style={{"backgroundColor": "#f0f0f080"}}>
                    <h3>SimSage Mind sign in</h3>

                    <div className="form-group spacer-height">
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary" onClick={() => handleLogin(instance)}>
                            Sign in using redirect
                        </button>
                    </div>

                    <p className="forgot-password text-right">
                        <span className="forgot-password-link" onClick={() => window.location = '/#/foss-license'}>open-source licenses</span>
                    </p>
                </div>
            </div>

        </div>

    );
}
