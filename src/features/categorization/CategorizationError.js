import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {closeErrorForm} from "./categorizationSlice";
// import {useMsal} from "@azure/msal-react";

export default function CategorizationError(){

    const dispatch = useDispatch();

    const show_error_form = useSelector((state) => state.categorizationReducer.show_error_form);
    const error_title = useSelector((state) => state.categorizationReducer.error_title);
    const error_message = useSelector((state) => state.categorizationReducer.error_message);

    // const session = useSelector((state) => state.authReducer.session)
    // const {instance} = useMsal();

    const handleOk = () => {
        dispatch(closeErrorForm());
        // dispatch(simsageLogOut({session_id: session.id}))
        // instance.logoutRedirect({
        //     postLogoutRedirectUri: "/",
        // });
    }

    if (!show_error_form)
        return (<div />);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{error_title}</h5>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{error_message}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleOk } type="button" className="btn btn-primary">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
