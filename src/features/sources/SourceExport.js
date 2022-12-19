import {useDispatch, useSelector} from "react-redux";
import {closeAlert} from "../alerts/alertSlice";
import {closeForm} from "./sourceSlice";
import {useState} from "react";

export function SourceExport(props) {

    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const dispatch = useDispatch()

    const title = "Export Crawler"
    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeForm())
    }

    return (
        <div>
            <div id={"error_alert"} className="modal alert-warning" tabIndex="-1" role="dialog"
                 style={{display: "inline", 'zIndex': 8000}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <div>
                                    <div>data</div>
                                    <div>
                                        <textarea placeholder="crawler data" spellCheck="true" rows="10"
                                                  style={{width: '100%'}} defaultValue={JSON.stringify(selected_source)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}