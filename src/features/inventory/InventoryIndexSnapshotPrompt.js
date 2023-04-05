import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, createIndexSnapshot} from "./inventorySlice";

export function InventoryIndexSnapshotPrompt() {
    const dispatch = useDispatch();

    const show_index_snapshot_form = useSelector((state) => state.inventoryReducer.show_index_snapshot_form)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;


    const title = "Create new index snapshot";
    let message = 'Are you sure you want to create a new index snapshot?';




    const handleClose = () => {
        console.log("InventoryDocumentSnapshotPrompt handleClose")
        dispatch(closeForm());
    }


    const handleOk = () => {
        const data = {
            organisationId: selected_organisation_id,
            kbId: selected_knowledge_base_id,
        }

        console.log("InventoryDocumentSnapshotPrompt handleOk")
        dispatch(createIndexSnapshot({session_id:session_id, data:data}))
        dispatch(closeForm());
    }


    if (!show_index_snapshot_form)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content py-4">

                    {/* <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div> */}
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <span className="label-wide">{message}</span>
                        </div>
                        <div className="control-row">
                            <button onClick={handleClose} type="button" className="btn btn-white btn-block px-4"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <button onClick={handleOk} type="button" className="btn btn-primary px-4">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}