import {useDispatch, useSelector} from "react-redux";
import {addDefaultSynsets, closeForm, deleteRecord} from "./synsetSlice";


export default function SynsetDefault(){

    const dispatch = useDispatch();
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_form = useSelector((state) => state.synsetReducer.show_add_default_form)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const title = "Add all Default Synsets";
    const body = "Are you sure you want to add all default Synsets?";

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeForm());
    }

    const handAddDefault = () => {
        const data = {"session_id": session_id, "organisation_id": selected_organisation_id, "kb_id": selected_knowledge_base_id};
        dispatch(addDefaultSynsets(data));
        console.log("add default")
        handleClose();
    }

    if (!show_form)
        return (<div />);

    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{body}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={ handAddDefault } type="button" className="btn btn-primary">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
