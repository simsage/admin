import React, {useState} from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";

import "../../css/sign-in.css";
import OpenSourceSoftwareLicenses from "../home/OpenSourceSoftwareLicenses";

function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.log(e)
    })
}

export const SignInButton = () => {
    // const image = "images/simsage-logo-no-strapline.svg";
    const { instance } = useMsal()

    const [show_license, setShowLicense] = useState(false);

    function toggleLicense() {
        setShowLicense(!show_license)
    }

    return (
        <div className="h-100">
            <div className="spinner">
            </div>
            {!show_license &&
                <div>
                    <div className="no-select auth-wrapper d-flex justify-content-center align-items-center overflow-auto">

                        <div className="auth-inner">

                            <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
                                <div className="d-flex justify-content-between align-items-end mb-3">
                                    <img src="/images/brand/simsage-logo-no-strapline.svg" alt="" className="auth-logo" />
                                    <p className="mb-1 fw-bold auth-text-primary fst-italic">ADMIN</p>
                                </div>
                                <div className="version small fw-300 text-black-50 text-end">Version {window.ENV.version}</div>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" onClick={() => {setShowLicense(false); handleLogin(instance)}}>Sign in
                                </button>
                            </div>

                            <p className="licence_link text-right">
                                <span onClick={() => toggleLicense()} className="forgot-password-link">open-source licenses</span>
                            </p>
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
