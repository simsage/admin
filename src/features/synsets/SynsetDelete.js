import {useDispatch, useSelector} from "react-redux";
import {closeForm, deleteRecord} from "./synsetSlice";


export default function SynsetDelete(){

    const dispatch = useDispatch();
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_delete_form = useSelector((state) => state.synsetReducer.show_delete_form)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const selected_synset = useSelector((state) => state.synsetReducer.selected_synset)

    const lemma = selected_synset?selected_synset.lemma:"not set";

    const title = "the synset id '"+ lemma + "'?";

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeForm());
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
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
              <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                  <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                      <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">delete {title}</h5>
                          <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                  aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                          <div className="control-row">
                              <span className="label-wide">Are you sure you wish to delete {title}?</span>
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
