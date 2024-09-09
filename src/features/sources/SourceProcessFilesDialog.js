import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {closeForm, processFiles} from "./sourceSlice";

export function SourceProcessFilesDialog() {
    const dispatch = useDispatch();

    const [process_internally, setProcessInternally] = useState(true)
    const selected_source = useSelector((state) => state.sourceReducer.selected_source)
    const show_process_files_prompt = useSelector((state) => state.sourceReducer.show_process_files_prompt)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const [url_list, setUrlList] = useState('');

    const session_id = session.id;

    if(!selected_source){
        dispatch(closeForm());
    }

    const source_name = (selected_source)?selected_source.name:'';
    let message1 = `Are you sure you want to re-process files in '${source_name}'? `;
    let message2 = "NB. Please stop any crawling activity first to keep your counters up-to-date.";

    const data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "sourceId": selected_source.sourceId,
        "usePipeLine": process_internally
    }

    const handleClose = () => {
        dispatch(closeForm());
    }


    const handleOk = () => {
        data["urlList"] = url_list;
        dispatch(processFiles({session_id: session_id, data: data}))
        dispatch(closeForm());
    }


    if (!show_process_files_prompt)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <p className="label-wide">{message1}</p>
                            <div className="alert alert-warning small py-2" role="alert">
                                {message2}
                            </div>
                        </div>

                        <label className="label-2 small">URL csv list (empty for all)</label>
                        <div>
                            <textarea className="form-control"
                                      placeholder="specific urls only... (leave blank to process all)"
                                      spellCheck="false" rows="5"
                                      style={{width: '100%'}}
                                      value={url_list}
                                      onChange={(event) => {
                                          setUrlList(event.target.value)
                                      }}
                            />
                        </div>
                        <br/>

                        <div className="form-check form-switch mt-2 mb-4"
                             title={process_internally ? "Push every file through the SimSage pipeline again." :
                                 "Invalidate every file's hash, and wait for the crawler to start again to re-process each file."}
                        >
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={process_internally}
                                onChange={(e) => setProcessInternally(e.target.checked)}
                            />
                            <label className="form-check-label small">
                                {process_internally ? "Move all files (or specific urls) through the pipeline again." :
                                "Invalidate file-change-hashes for future Crawler re-processing"}
                            </label>
                        </div>

                        <div className="control-row">
                            <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <button onClick={handleOk} type="button" className="btn btn-primary px-4 me-2">Start
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}