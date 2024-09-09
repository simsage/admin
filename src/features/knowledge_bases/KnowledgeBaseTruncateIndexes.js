import {useDispatch, useSelector} from "react-redux";
import {closeTruncateIndexes, truncateSlowIndexes} from "./knowledgeBaseSlice";

export default function KnowledgeBaseTruncateIndexes() {

    const dispatch = useDispatch();

    const show_optimize_form = useSelector((state) => state.kbReducer.show_truncate_indexes_form)
    const selected_kb = useSelector((state) => state.kbReducer.truncate_indexes_data.kb)
    const session_id = useSelector((state) => state.kbReducer.truncate_indexes_data.session_id)

    //handle form close or cancel
    const handleClose = () => dispatch(closeTruncateIndexes())

    const handleOptimize = () => {
        const data = {
            "session_id": session_id,
            "organisation_id": selected_kb.organisationId,
            "kb_id": selected_kb.kbId
        };
        dispatch(truncateSlowIndexes(data));
        dispatch(closeTruncateIndexes());
    }


    if (!show_optimize_form)
        return <div/>

    const name = selected_kb && selected_kb.name ? '"' + selected_kb.name + '"' : "";
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <div className="label-wide">Are you sure you wish to truncate the slow indexes</div>
                                <div className="label-wide">of knowledge-base {name}?</div>
                            </div>

                            <div className="control-rowr">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <button onClick={handleOptimize} type="button"
                                        className="btn btn-primary px-4">Truncate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
