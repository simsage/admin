import {useDispatch, useSelector} from "react-redux";
import {addDefaultSynsets, closeDefaultAskForm} from "./synsetSlice";


export default function SynsetDefault(){

    const dispatch = useDispatch();
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_form = useSelector((state) => state.synsetReducer.show_add_default_form)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const body = "Are you sure you want to add all default Synsets?";

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDefaultAskForm());
    }

    const handAddDefault = () => {
        const data = {"session_id": session_id, "organisation_id": selected_organisation_id, "kb_id": selected_knowledge_base_id};
        dispatch(addDefaultSynsets(data));
        handleClose();
    }

    if (!show_form)
        return (<div />);

    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content py-4">

                        {/* <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div> */}
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">{body}</span>
                            </div>
                            <div className="control-row">
                                <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Cancel</button>
                                <button onClick={ handAddDefault } type="button" className="btn btn-primary px-4">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
