import {useDispatch, useSelector} from "react-redux";
import {closeDelete} from "./knowledgeBaseSlice";

export default function KnowledgeBaseDeleteInfo(){

    const dispatch = useDispatch();

    const show_delete_info_form = useSelector((state) => state.kbReducer.show_delete_info_form)
    const selected_kb = useSelector((state) => state.kbReducer.delete_data.kb)

    //handle form close or cancel
    const handleClose = () => dispatch(closeDelete())

    if (!show_delete_info_form)
        return <div/>
    const name = selected_kb && selected_kb.name ? '"' + selected_kb.name + '"' : "";
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5rounded">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">information</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                  aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <div className="text">SimSage is removing knowledge-base {name}.</div>
                                <div className="text">This might take some time.</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                          <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
