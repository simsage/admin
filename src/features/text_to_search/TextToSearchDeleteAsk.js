import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteTextToSearch} from "./TextToSearchSlice";


export default function TextToSearchDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const show_delete_form = useSelector((state) => state.textToSearchReducer.show_delete_form)
    const selected_item = useSelector( (state) => state.textToSearchReducer.edit);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledgeBase_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        const data = {"session_id": session_id, "organisation_id": organisation_id, "kb_id": knowledgeBase_id, "word": selected_item.searchPart };

        //dispatch(deleteSynonym(data));
        dispatch(deleteTextToSearch(data));
        dispatch(closeDeleteForm());
    }


    if (!show_delete_form)
        return (<div />);
    const message = selected_item && selected_item.searchPart ? ` : ${selected_item.searchPart}` : ` all of the search items`;
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">Are you sure you wish to delete {message}?</span>
                            </div>
                            <div className="control-row">
                                <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Close</button>
                                <button onClick={ handleDelete } type="button" className="btn btn-danger px-4">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
