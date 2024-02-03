import {useDispatch, useSelector} from "react-redux";
// import {closeAlert} from "../alerts/alertSlice";
import {closeForm, safeSourceForImportOrExport} from "./sourceSlice";
// import {useState} from "react";

export function SourceExport() {

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
                 style={{display: "inline", 'zIndex': 8000, background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content">

                    <div className="modal-header px-5 pt-4 bg-light">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            {/* <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button> */}
                        </div>
                        <div className="modal-body p-0">
                            <div className="tab-content px-5 py-4 overflow-auto">
                                <div className="row mb-3">
                                    <div className="control-row col-12">
                                        <div>
                                        <label className="label-2 small">Data</label>
                                            <div>
                                                <textarea className="form-control" placeholder="Crawler data..." spellCheck="true" rows="10"
                                                        style={{width: '100%'}} defaultValue={JSON.stringify(safeSourceForImportOrExport(selected_source))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer px-5 pb-4">
                            <button onClick={handleClose} type="button" className="btn btn-primary px-4"
                                    data-bs-dismiss="modal">Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}