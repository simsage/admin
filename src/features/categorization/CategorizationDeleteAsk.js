import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteCategorization} from "./categorizationSlice"


export default function CategorizationDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const show_delete_form = useSelector((state) => state.categorizationReducer.show_delete_form)
    const category = useSelector( (state) => state.categorizationReducer.edit);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledgeBase_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        const data = {"session_id": session_id, "organisation_id": organisation_id, "knowledge_base_id": knowledgeBase_id, "metadata": category.metadata };
        dispatch(deleteCategorization({session_id: session_id, organisation_id: organisation_id, knowledge_base_id: knowledgeBase_id, categorizationLabel: category.categorizationLabel }))
        dispatch(closeDeleteForm())
    }


    if (!show_delete_form)
        return (<div />);
    const message = category && category.categorizationLabel ? ` Category item: ${category.categorizationLabel}` : ` all of the Category items`;
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
