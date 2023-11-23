import React, {useState} from 'react';

import '../css/sign-in.css';
import {useDispatch, useSelector} from "react-redux";
import Api from "../common/api";
import {closeError, simsagePasswordSignIn} from "../features/auth/authSlice";
import ErrorMessage from "../common/ErrorMessage";
import App from "../App";
import OpenSourceSoftwareLicenses from "../features/home/OpenSourceSoftwareLicenses";
import {ResetPasswordRequest} from "./reset_password_request";
import {getSearchParameterMap} from "../common/comms";
import {ResetPasswordResponse} from "./reset_password_response";
import {setOrganisationList} from "../features/organisations/organisationSlice";


// sign-in screen
export const PasswordSignIn = () => {

    const dispatch = useDispatch()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {session, error_text} = useSelector((state) => state.authReducer);

    const show_admin = session && session.id && session.id.length > 0;
    const search_parameters = getSearchParameterMap();
    let reset_id = '';
    let email = '';
    let screen = 'login';
    if (search_parameters && search_parameters.resetid && search_parameters.email) {
        screen = 'password-reset';
        reset_id = search_parameters.resetid;
        email = search_parameters.email;
    }

    // one of license, login, password-reset-request, password-reset, app
    const [display_screen, setDisplayScreen] = useState(screen);

    function doSignIn() {
        dispatch(simsagePasswordSignIn({"email": username, "password": password, "on_success": (data) => {
                dispatch(setOrganisationList(data));
            }}));
    }

    function clearError() {
        dispatch(closeError());
    }

    function toggleLicense() {
        if (display_screen === 'login')
            setDisplayScreen('license');
        else
            setDisplayScreen('login');
    }

    function gotoPasswordReset() {
        setDisplayScreen('password-reset-request');
    }

    function closePasswordReset() {
        setDisplayScreen('login');
    }

    function closePasswordResetResponse() {
        const index = window.location.toString().indexOf('?');
        if (index > 0) {
            window.location = window.location.toString().substring(0, index);
        }
        setDisplayScreen('login');
    }

    function onKeyPress(event) {
        if (event.key === "Enter") {
            doSignIn();
        }
    }

    const error_obj = {"code": "sign-in", "message": error_text};

    if (show_admin) {
        return (<App/>)
    }

    return (
        <div>
            <ErrorMessage error={error_obj}
                          close={() => clearError()} />

            { display_screen === 'password-reset-request' &&
                <ResetPasswordRequest close={() => closePasswordReset()} />
            }

            { display_screen === 'password-reset' &&
                <ResetPasswordResponse reset_id={reset_id} email={email} close={() => closePasswordResetResponse()} />
            }

            {display_screen === 'login' &&
            <div className="no-select auth-wrapper d-flex justify-content-center align-items-center overflow-auto">

                <div className="auth-inner">

                    <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
                        <div className="d-flex align-items-end">
                            <img alt="SimSage" title="Search Reimagined" src="images/simsage-logo-no-strapline.svg"
                                 className="auth-logo" onClick={() => { window.location = window.ENV.api_base.replace('/api', '/'); }} />
                            <p className="mb-1 fw-bold auth-text-primary fst-italic">ADMIN</p>
                        </div>
                        <div className="version">Version {Api.pretty_version()}</div>
                    </div>

                    <div className="form-group form-label">
                        <label className="label-text">Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" autoFocus={true}
                               value={username}
                               onKeyPress={(event) => onKeyPress(event)}
                               onChange = {(event) => setUsername(event.target.value) }
                        />
                    </div>

                    <div className="form-group form-label">
                        <label className="label-text">Password</label>
                        <input type="password" className="form-control" placeholder="Enter password"
                               value={password}
                               onKeyPress={(event) => onKeyPress(event)}
                               onChange = {(event) => setPassword(event.target.value) }
                        />
                    </div>

                    <div className="form-group spacer-height">
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" onClick={() => {
                            // clear any existing state
                            doSignIn();
                        }}>Sign in</button>
                    </div>

                    <p className="forgot-password" onClick={() => gotoPasswordReset()}>
                        <span className="forgot-password-link">forgot password?</span>
                    </p>

                    <p className="forgot-password" onClick={() => toggleLicense()}>
                        <span className="forgot-password-link">open-source licenses</span>
                    </p>

                </div>
            </div>
            }

            { display_screen === 'license' &&
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

export default PasswordSignIn;
