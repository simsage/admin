import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteCategorization, loadCategorizations} from "./categorizationSlice"


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
        console.log(`deleteing...`, data)
        dispatch(deleteCategorization({session_id: session_id, organisation_id: organisation_id, knowledge_base_id: knowledgeBase_id, categorizationLabel: category.categorizationLabel }))
        dispatch(closeDeleteForm())
    }


    if (!show_delete_form)
        return (<div />);
    const message = category && category.categorizationLabel ? ` category item: ${category.categorizationLabel}` : ` all of the category items`;
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
