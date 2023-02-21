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
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">delete {message}?</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">Are you sure you wish to delete {message}?</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={ handleDelete } type="button" className="btn btn-primary">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
