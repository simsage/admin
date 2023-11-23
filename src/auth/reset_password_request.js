import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeError, requestResetPassword, showError} from "../features/auth/authSlice";
import {is_valid_email} from "../common/comms";
import ErrorMessage from "../common/ErrorMessage";
import Api from "../common/api";
import '../css/sign-in.css';
import {MessageDialog} from "../common/MessageDialog";


export const ResetPasswordRequest = (props) => {
    const dispatch = useDispatch();
    const {error_text} = useSelector((state) => state.authReducer);
    const [email, set_email] = useState('');

    function on_key_press(event) {
        if (event.key === "Enter") {
            reset_password();
        }
    }
    function clearError() {
        dispatch(closeError());
    }

    function reset_password() {
        //To be done:check for empty values before hitting submit
        if (is_valid_email(email)) {
            dispatch(requestResetPassword({email: email}));
        } else {
            dispatch(showError({
                "message": "invalid email address",
                "title": "password reset"
            }));
        }
    }
    function on_sign_in() {
        if (props.close) props.close();
    }

    const error_obj = {"code": "password reset", "message": error_text};

    return (
        <div className="h-100">

            <ErrorMessage error={error_obj}
                          close={() => clearError()} />
            <MessageDialog />

            <div className="auth-wrapper d-flex justify-content-center align-items-center overflow-auto">
                <div className="auth-inner">
                    <div>
                        <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom">
                            <div className="d-flex align-items-end">
                                <img src="images/brand/simsage-logo-no-strapline.svg" alt="" className="auth-logo" />
                                {/* {window.ENV.app_title} */}
                                <p className="mb-1 fw-bold auth-text-primary fst-italic">SEARCH</p>
                            </div>
                            <div className="version">Version {Api.pretty_version()}</div>
                        </div>
                        <h6 className="mb-2">Reset Password</h6>
                        <div className="no-select help-text fw-light">Please enter your email address and we'll email you a link to reset your password.</div>

                        <br />

                        <div className="form-group">
                            <label className="small text-muted">Email</label>
                            <input type="email" className="form-control" placeholder="example@email.com" autoFocus={true}
                                   value={email}
                                   onKeyDown={(event) => on_key_press(event)}
                                   onChange = {(event) => set_email(event.target.value)}
                            />
                        </div>

                        <br />
                        <button type="submit" className="btn btn-primary btn-block w-100 my-2"
                                onClick={() => reset_password()}>Send Link</button>

                        <br />
                        <br />

                        <p className="forgot-password">
                            Back to <span className="forgot-password-link" onClick={() => on_sign_in()}>Sign in?</span>
                        </p>

                    </div>
                </div>
            </div>


        </div>
    )
}

