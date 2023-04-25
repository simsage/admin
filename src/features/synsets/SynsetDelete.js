import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteRecord} from "./synsetSlice";


export default function SynsetDelete(){

    const dispatch = useDispatch();
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_delete_form = useSelector((state) => state.synsetReducer.show_delete_form)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const selected_synset = useSelector((state) => state.synsetReducer.edit)

    const lemma = selected_synset?selected_synset.lemma:"not set";

    const title = "the synset '"+ lemma + "'";

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        const data = {"session_id": session_id, "organisation_id": selected_organisation_id, "kb_id": selected_knowledge_base_id,"lemma":selected_synset.lemma};
        dispatch(deleteRecord(data));
        handleClose();
    }

    if (!show_delete_form)
        return (<div />);

    return(
        <div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                              <span className="label-wide">Are you sure you wish to delete {title}?</span>
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
