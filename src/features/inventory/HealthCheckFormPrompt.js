import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, healthCheck} from "./inventorySlice";

export function HealthCheckFormPrompt() {
    const dispatch = useDispatch();

    const show_health_check_form = useSelector((state) => state.inventoryReducer.show_health_check_form)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;

    // const title = "Create new index snapshot";
    let message = 'Are you sure you want to perform a knowledge-base health check?';

    const handleClose = () => {
        dispatch(closeForm());
    }

    const handleOk = () => {
        dispatch(healthCheck({
            session_id:session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))
        dispatch(closeForm());
    }


    if (!show_health_check_form)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <span className="label-wide">{message}</span>
                        </div>
                        <div className="control-row">
                            <button onClick={handleClose} type="button" className="btn btn-white btn-block px-4"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <button onClick={handleOk} type="button" className="btn btn-primary px-4">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}