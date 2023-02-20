import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, processFiles} from "./sourceSlice";

export function SourceProcessFilesDialog() {
    const dispatch = useDispatch();

    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const show_process_files_prompt = useSelector((state) => state.sourceReducer.show_process_files_prompt)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;

    if(!selected_source){
        console.error("Missing source")
        dispatch(closeForm());
    }

    const title = "Process all files for Crawler";
    const source_name = (selected_source)?selected_source.name:'';
    let message1 = `Are you sure you want to process all files for '${source_name}'? `;
    let message2 = "NB. Please stop any crawling activity first to keep your counters up-to-date.";

    const data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "sourceId": selected_source.sourceId
    }

    const handleClose = () => {
        console.log("SourceProcessFilesDialog handleClose")
        dispatch(closeForm());
    }


    const handleOk = () => {
        console.log("SourceProcessFilesDialog handleClose")
        dispatch(processFiles({session_id:session_id, data:data}))
        dispatch(closeForm());
    }


    if (!show_process_files_prompt)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="control-row">
                                <span className="label-wide">{message1}</span>
                        </div>
                        <div className="control-row">
                            <br />
                            <span className="label-wide">{message2}</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleClose} type="button" className="btn btn-secondary"
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button onClick={handleOk} type="button" className="btn btn-primary">Start</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}