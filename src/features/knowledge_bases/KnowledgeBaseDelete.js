import {useDispatch, useSelector} from "react-redux";
import {closeDelete, showDeleteInfo, deleteRecord} from "./knowledgeBaseSlice";

export default function KnowledgeBaseDelete(){

    const dispatch = useDispatch();

    const show_delete_form = useSelector((state) => state.kbReducer.show_delete_form)
    const selected_kb = useSelector((state) => state.kbReducer.delete_data.kb)
    const session_id = useSelector((state) => state.kbReducer.delete_data.session_id)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDelete());
    }

    const handleDelete = () => {
        console.log("delete", selected_kb.kbId);
        const data = {"session_id": session_id, "organisation_id": selected_kb.organisationId, "kb_id": selected_kb.kbId};
        console.log("delete data",data)
        dispatch(deleteRecord(data));
        dispatch(showDeleteInfo());
    }


    if (!show_delete_form)
        return (<div />);
    const name = selected_kb && selected_kb.name ? '"' + selected_kb.name + '"' : "";
    return(
      <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
              <div className={"modal-dialog modal-dialog-centered"} role="document">
                  <div className="modal-content p-4">
                      <div className="modal-body text-center">
                          <div className="control-row mb-4">
                              <span className="label-wide">Are you sure you wish to delete the Knowledge Base {name}?</span>
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
