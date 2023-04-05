import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, zipSource} from "./sourceSlice";

export function SourceZipDialog() {
    const dispatch = useDispatch();

    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const show_zip_crawler_prompt = useSelector((state) => state.sourceReducer.show_zip_crawler_prompt)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;

    if(!selected_source){
        console.error("Missing source")
        dispatch(closeForm());
    }

    const data = {
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "sourceId": selected_source.sourceId
    }


    const title = "Zip Source";
    const source_name = (selected_source)?selected_source.name:'';
    const message = `Are you sure you want to zip the content of '${source_name}'? `;


    const handleClose = () => {
        console.log("SourceZipDialog handleClose")
        dispatch(closeForm());
    }


    const handleOk = () => {
        console.log("SourceZipDialog handleClose")
        dispatch(zipSource({session_id:session_id,data:data}))
        dispatch(closeForm());
    }


    if (!show_zip_crawler_prompt)
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
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                                <span
                                    className="label-wide">{message}</span>
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