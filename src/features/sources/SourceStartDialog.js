import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, startSource} from "./sourceSlice";

export function SourceStartDialog() {
    const dispatch = useDispatch();

    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const show_start_crawler_prompt = useSelector((state) => state.sourceReducer.show_start_crawler_prompt)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;

    if(!selected_source){
        console.error("Missing source")
        dispatch(closeForm());
    }

    const title = "Start crawler";
    const source_name = (selected_source)?selected_source.name:'';
    const message = `Are you sure you want to start '${source_name}'? `;

    const data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "sourceId": selected_source.sourceId
    }

    const handleClose = () => {
        console.log("BkOrganisationBackupDialog handleClose")
        dispatch(closeForm());
    }


    const handleOk = () => {
        console.log("BkOrganisationBackupDialog handleClose")
        dispatch(startSource({session_id:session_id, data:data}))
        dispatch(closeForm());
    }


    if (!show_start_crawler_prompt)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">

                    {/* <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div> */}
                    <div className="modal-body">
                        <div className="control-row mb-4">
                            <span className="label-wide">{message}</span>
                        </div>

                        <div className="control-row">
                            <button onClick={handleClose} type="button" className="btn btn-white px-4"
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