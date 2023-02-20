import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm} from "./sourceSlice";

export function SourceZipDialog() {
    const dispatch = useDispatch();

    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const show_zip_crawler_prompt = useSelector((state) => state.sourceReducer.show_zip_crawler_prompt)

    if(!selected_source){
        console.error("Missing source")
        dispatch(closeForm());
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
        dispatch(closeForm());
    }


    if (!show_zip_crawler_prompt)
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
                                <span
                                    className="label-wide">{message}</span>
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