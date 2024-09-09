import {useDispatch, useSelector} from "react-redux";
import React from 'react';
import {useKeycloak} from "@react-keycloak/web";
import {simsageLogOut} from "../features/auth/authSlice";


export default function ErrorMessage( {error, close} ){

    const dispatch = useDispatch();
    const keycloak = useKeycloak();
    const session = useSelector((state) => state.authReducer.session)

    if (!error || !error.message || !error.code) {
        return <div/>
    }

    const error_title = error.code
    const error_text = error.message


    /**
     * check if we need to sign-out or just close the message
     */
    function on_close() {
        if (error_text && error_text.indexOf("insufficient permissions") >= 0) {
            if (keycloak && keycloak.authenticated) {
                dispatch(simsageLogOut({session_id: session?.id, keycloak}))
            }
        } else if (close) {
            close()
        }
    }

    return (
        <div className="modal"  tabIndex="-1" role="dialog" style={{display: "inline", zIndex: 1061}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel" title={error_title}>{error_title}</h5>
                        <button onClick={close} type="button" className="btn-close" data-bs-dismiss="modal"
                                title="close this error message" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="control-row">
                            <span title={error_text} className="label-wide">{error_text}</span>
                        </div>
                        <div className="control-row">
                            <span className="label-wide text fst-italic">
                                Please try again. If the problem persists contact the SimSage Customer Support Team
                            </span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={on_close} type="button" title="close this error message"
                                className="btn btn-primary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}