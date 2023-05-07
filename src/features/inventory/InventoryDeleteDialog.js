import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeForm, deleteRecord} from "./inventorySlice";
import Api from "../../common/api";

export function InventoryDeleteDialog() {
    const dispatch = useDispatch();

    const show_delete_form = useSelector((state) => state.inventoryReducer.show_delete_form)
    const selected_inventory = useSelector((state) => state.inventoryReducer.selected_inventory)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session)

    const session_id = session.id;


    console.log("selected_inventory",selected_inventory)
    // const title = "Remove Inventory Report";
    let message = 'Are you sure you want to remove the report dated ' + Api.unixTimeConvert(selected_inventory.time) + '?';



    const handleClose = () => {
        console.log("InventoryDeleteDialog handleClose")
        dispatch(closeForm());
    }


    const handleOk = () => {

        console.log("InventoryDeleteDialog handleOk")
        const data = {
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id,
            inventory_date_time: selected_inventory.time}

        dispatch(deleteRecord(data))
        dispatch(closeForm());
    }


    if (!show_delete_form)
        return (<div/>);

    return (
    <div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <span className="label-wide">{message}</span>
                        </div>

                        <div className="control-row">
                            <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <button onClick={handleOk} type="button" className="btn btn-danger px-4y">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}