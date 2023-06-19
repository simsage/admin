import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, createDocumentSnapshot, showAddInfoForm} from "./inventorySlice";

export function InventoryDocumentSnapshotPrompt() {
    const dispatch = useDispatch();

    const show_document_snapshot_form = useSelector((state) => state.inventoryReducer.show_document_snapshot_form)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;
    // const title = "New Document Snapshot";
    let message = 'Are you sure you want to create a new document snapshot?';

    const handleClose = () => {
        dispatch(closeForm());
    }


    const handleOk = () => {
        const data = {
            organisationId: selected_organisation_id,
            kbId: selected_knowledge_base_id,
        }

        dispatch(createDocumentSnapshot({session_id:session_id, data:data}))
        dispatch(closeForm());
        dispatch(showAddInfoForm('doc'))
    }


    if (!show_document_snapshot_form)
        return (<div/>);

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
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