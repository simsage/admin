import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeErrorMessage} from "./synonymSlice";
import {useMsal} from "@azure/msal-react";
// import {simsageLogOut} from "../auth/authSlice";

export function SynonymErrorDialog() {
    const dispatch = useDispatch();

    const show_error_form = useSelector((state) => state.synonymReducer.show_error_form);
    const error_title = useSelector((state) => state.synonymReducer.error_title);
    const error_message = useSelector((state) => state.synonymReducer.error_message);
    // const session = useSelector((state) => state.authReducer.session)
    // const {instance} = useMsal();

    const handleClose = () => {
        dispatch(closeErrorMessage());
        // dispatch(simsageLogOut({session_id: session.id}))
        // instance.logoutRedirect({
        //     postLogoutRedirectUri: "/",
        // });
    }


    if (!show_error_form)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline",  zIndex: 1061}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{error_title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="control-row">
                                <span
                                    className="label-wide">{error_message}</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleClose} type="button" className="btn btn-primary">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}