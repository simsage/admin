import {useDispatch, useSelector} from "react-redux";
import {closeDelete, showDeleteInfo, deleteRecord, getKBList} from "./knowledgeBaseSlice";

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
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
              <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                  <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                      <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">delete knowledge-base {name}?</h5>
                          <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                  aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                          <div className="control-row">
                              <span className="label-wide">Are you sure you wish to delete knowledge-base {name}?</span>
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
