import {useDispatch, useSelector} from "react-redux";
// import {closeAlert} from "../alerts/alertSlice";
import {closeForm, updateSources} from "./sourceSlice";
// import {useState} from "react";
import {useForm} from "react-hook-form";

export function SourceImport() {

    const dispatch = useDispatch()
    const session = useSelector((state) => state.authReducer.session)
    const session_id = session.id
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const show_error_form = useSelector((state) => state.sourceReducer.show_error_form);
    // const error_title = useSelector((state) => state.sourceReducer.error_title);
    const error_message = useSelector((state) => state.sourceReducer.error_message);

    //Form Hook
    const {register, handleSubmit} = useForm();


    const title = "Import Crawler"
    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeForm())
    }


    const onSubmit = data => {
        let crawler = JSON.parse(data.source_str);
        console.log("data", crawler)
        delete crawler.sourceId;
        console.log("data", crawler)
        console.log("selected_organisation_id", selected_organisation_id)
        console.log("selected_knowledge_base_id", selected_knowledge_base_id)

        crawler = {...crawler, organisationId:selected_organisation_id, kbId:selected_knowledge_base_id}
        console.log("data", crawler)

        dispatch(updateSources({session_id:session_id, data: crawler}))

        // handleClose()
    };



    return (
        <div>
            <div id={"error_alert"} className="modal alert-warning" tabIndex="-1" role="dialog"
                 style={{display: "inline", 'zIndex': 8000, background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content">

                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-header px-5 pt-4 bg-light">
                            <h4 className="mb-0" id="staticBackdropLabel">{title}</h4>
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
                                                <textarea className="form-control" placeholder="Crawler data JSON..." spellCheck="true" rows="10"
                                                        style={{width: '100%'}} {...register("source_str", {required: true})} />
                                            </div>
                                        </div>
                                    </div>

                                {show_error_form && error_message.length > 2 &&
                                    <div className="control-row alert-danger">
                                        <p className={"alert alert-danger"}>{error_message}</p>
                                    </div>
                                }

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer px-5 pb-4">
                            <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                    data-bs-dismiss="modal">Cancel
                            </button>

                            <input type="submit" value={"Import"} className={"btn btn-primary px-4"}/>

                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
}