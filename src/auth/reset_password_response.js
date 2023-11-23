import React, {useState} from "react";

import '../css/sign-in.css';
import {useDispatch, useSelector} from "react-redux";
import ErrorMessage from "../common/ErrorMessage";
import Api from "../common/api";
import {is_valid_email} from "../common/comms";
import {closeError, resetPassword, showError} from "../features/auth/authSlice";
import {MessageDialog} from "../common/MessageDialog";

/**
 * reset password system dialog
 *
 */
export function ResetPasswordResponse(props) {
    const dispatch = useDispatch();

    const [email, set_email] = useState(props.email ? props.email : '');
    const [password, set_password] = useState('');
    const [reset_id, set_reset_id] = useState(props.reset_id ? props.reset_id : '');
    const {error_text} = useSelector((state) => state.authReducer);

    // do the reset request
    function clearError() {
        dispatch(closeError());
    }

    function on_reset_password() {
        if (is_valid_email(email) && reset_id.trim().length > 10 && password.length > 5) {
            dispatch(resetPassword({email: email, reset_id: reset_id, password: password}));
        } else {
            if (!is_valid_email(email)) {
                dispatch(showError({
                    "message": "invalid email address",
                    "title": "password reset"
                }));
            } else if (reset_id.trim().length <= 10) {
                dispatch(showError({
                    "message": "invalid reset id",
                    "title": "password reset"
                }));
            } else {
                dispatch(showError({
                    "message": "password must be at least 8 characters",
                    "title": "password reset"
                }));
            }
        }
    }

    // see if we've pressed enter
    function on_key_press(event) {
        if (event.key === "Enter") {
            on_reset_password();
        }
    }

    function on_sign_in() {
        if (props.close) props.close();
    }

    const error_obj = {"code": "sign-in", "message": error_text};

    return (
        <div>
            <div className="no-select auth-wrapper d-flex justify-content-center align-items-center overflow-auto">

                <ErrorMessage error={error_obj}
                              close={() => clearError()} />
                <MessageDialog />


                <div className="auth-inner">

                    <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
                        <div className="d-flex align-items-end">
                            <img alt="SimSage" title="Search Reimagined" src="images/brand/simsage-logo-no-strapline.svg"
                                 className="auth-logo" onClick={() => { window.location = window.ENV.api_base.replace('/api', '/'); }} />
                            <p className="mb-1 fw-bold auth-text-primary fst-italic">SEARCH</p>
                        </div>
                        <div className="version">Version {Api.pretty_version()}</div>
                    </div>

                    <h3>Reset password</h3>

                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control reset-password-width" placeholder="Enter email" autoFocus={true}
                               value={email}
                               onKeyDown={(event) => on_key_press(event)}
                               onChange = {(event) => set_email(event.target.value) }
                        />
                    </div>

                    <div className="form-group">
                        <label>Reset id</label>
                        <input type="text" className="form-control reset-password-width" placeholder="Enter the reset-id we sent you"
                               value={reset_id}
                               autoComplete={"false"}
                               onKeyDown={(event) => on_key_press(event)}
                               onChange = {(event) => set_reset_id(event.target.value) }
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control reset-password-width" placeholder="Enter your new password"
                               onKeyDown={(event) => on_key_press(event)}
                               autoFocus={true}
                               onChange = {(event) => set_password(event.target.value) }
                        />
                    </div>

                    <br />

                    <button type="submit" className="btn btn-primary btn-block w-100 my-2" onClick={() => on_reset_password()}>Submit</button>

                    <br />
                    <br />

                    <p className="forgot-password" onClick={() => on_sign_in()}>Back to <span className="forgot-password-link">sign in?</span>
                    </p>

                </div>
            </div>
        </div>
    );
}

