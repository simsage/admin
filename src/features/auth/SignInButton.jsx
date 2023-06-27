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
        <div className="h-100">
            <div className="spinner">
            </div>
            {/* <div className="logo-box">
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
            </div> */}

            {!show_license &&
                <div className="auth-wrapper d-flex justify-content-center align-items-center overflow-auto">
                    <div className="auth-inner">
                        <div>
                            <div className="d-flex justify-content-between align-items-end mb-3">
                                <div className="d-flex align-items-end">
                                    <img src="../images/brand/simsage-logo-no-strapline.svg" alt="" className="auth-logo" />
                                    <p className="mb-1 fw-bold text-primary fst-italic">ADMIN</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowLicense(false); handleLogin(instance) }} className="btn btn-primary w-100 py-2">Sign in</button>
                            <div className="d-flex justify-content-between mt-4">
                                <p className="small text-primary text-decoration-underline pointer-cursor" title="view the open-source licenses used" onClick={() => toggleLicense()}>Open-source licenses</p>
                                <p className="small fst-italic fw-300 text-black-50 text-end">Version xxx</p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {show_license &&
                <div className="h-100 d-flex overflow-auto">
                    <div>
                        <button className="btn px-3 m-3" title="view the open-source licenses used" onClick={() => toggleLicense()}>
                            <h2 className="mb-0">&times;</h2>
                        </button>
                    </div>
                    <OpenSourceSoftwareLicenses/>
                </div>
            }

            

        </div>

    );
}
