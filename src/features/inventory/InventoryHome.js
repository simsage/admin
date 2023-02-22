import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import Comms from "../../common/comms";
import {
    loadInventoryList,
    showDeleteInventoryForm,
    showDocumentSnapshotForm,
    showIndexSnapshotForm
} from "./inventorySlice";
import {InventoryDocumentSnapshotPrompt} from "./InventoryDocumentSnapshotPrompt";
import {InventoryIndexSnapshotPrompt} from "./InventoryIndexSnapshotPrompt";
import {InventoryDeleteDialog} from "./InventoryDeleteDialog";


export default function InventoryHome(props) {
    // const title = "Inventory";
    const theme = '';
    const selected_organisation = "ORg1"

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    const show_document_snapshot_form = useSelector((state) => state.inventoryReducer.show_document_snapshot_form)
    const show_index_snapshot_form = useSelector((state) => state.inventoryReducer.show_index_snapshot_form)
    const show_delete_form = useSelector((state) => state.inventoryReducer.show_delete_form)


    const inventory_list = useSelector((state) => state.inventoryReducer.inventory_list);
    const data_status = useSelector((state) => state.inventoryReducer.data_status);
    const [error, setError] = useState('')


    useEffect(() => {
        console.log("Inventory useEffect")
        dispatch(loadInventoryList({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))

    }, [data_status === 'load_now', props.tab])

    //TODO::inventorize_busy
    const inventorize_busy = false;


    // function programConverted(program) {
    //     if (program) {
    //         window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
    //     }
    // }

    function inventorizeDump(dateTime) {
        if (session && session.id)
            Comms.download_inventorize_dump(selected_organisation_id, selected_knowledge_base_id, dateTime, session.id);
    }

    function inventorizeDumpSpreadsheet(dateTime) {
        if (session && session.id)
            Comms.download_inventorize_dump_spreadhseet(selected_organisation_id, selected_knowledge_base_id, dateTime, session.id);
    }

    function deleteInventorizeAsk(dateTime) {
        this.setState({date_time: dateTime});
        this.props.openDialog("are you sure you want to remove the report dated <b>" + Api.unixTimeConvert(dateTime) + "</b>?",
            "Remove Inventory Report", (action) => {
                deleteReport(action)
            });
    }

    function deleteReport(action) {
        if (action) {
            this.props.deleteInventoryItem(this.state.date_time);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    function restore(data) {
        if (data) {
            this.setState({uploading: true});
            Api.restore(data,
                () => {
                    this.setState({
                        uploading: false,
                        message_title: "Success",
                        message: "data restored",
                        message_callback: () => {
                            this.setState({message: "", message_title: ""})
                        }
                    });
                },
                (errStr) => {
                    setError("Error", errStr);
                })
        }
    }

    function isVisible() {
        return selected_organisation_id && selected_organisation_id.length > 0 &&
            selected_organisation && selected_organisation.length > 0 &&
            selected_knowledge_base_id && selected_knowledge_base_id.length > 0;
    }

    function itemNameToDescription(name) {
        if (name === "content spreadsheet")
            return "Content analysis SpreadSheet";
        else if (name === "content parquet")
            return "Content analysis Parquet file";
        else if (name === "indexes parquet" || name === 'index parquet')
            return "Index analysis Parquet file";
        else if (name === "indexes spreadsheet")
            return "Index analysis SpreadSheet";
        else return name;
    }

    //todo::getInventoryList
    function getInventoryList() {
        console.log("refresh the inventory list")
    }

    //todo::getInventoryBusy
    function getInventoryBusy() {
        console.log("refresh the inventory list")
    }

    //todo::forceInventoryBusy
    function forceInventoryBusy() {
        console.log("forceInventoryBusy")
    }

    //todo::createIndexInventory
    function createIndexInventory() {
        console.log("createIndexInventory")
    }

//-------------------------------


    function handleCreateDocumentSnapshot() {
        dispatch(showDocumentSnapshotForm())
    }

    function handleCreateIndexSnapshot() {
        dispatch(showIndexSnapshotForm())
    }

    function handleDelete(inventory) {
        console.log("handleDelete")
        dispatch(showDeleteInventoryForm({inventory}))
    }


    return (
        <div className="section px-5 pt-4">
            {isVisible() &&
                <div className={theme === 'light' ? "hr" : "hr_dark"}/>
            }

            {/*{isVisible() &&*/}

            {/*    <div className="inventory-label">Manage snapshots of your document inventory.*/}
            {/*        {inventorize_busy &&*/}
            {/*            <span>  SimSage is busy creating a new snapshot.</span>*/}
            {/*        }*/}
            {/*        {selected_organisation_id.length > 0 &&*/}
            {/*            <img src="../images/refresh.svg" alt="refresh"*/}
            {/*                 title="refresh the inventory list"*/}
            {/*                 onClick={() => {*/}
            {/*                     getInventoryList();*/}
            {/*                     getInventoryBusy();*/}
            {/*                 }}*/}
            {/*                 className="refresh-image sb-logo "/>*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*}*/}

            {isVisible() &&
                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <th className='table-header table-width-25'>Type</th>
                            <th className='table-header table-width-33'>Created</th>
                            <th className='table-header'></th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventory_list && inventory_list.timeList && inventory_list.timeList.map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="snapshot-item">
                                            {itemNameToDescription(item.name)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="snapshot-item">
                                            {Api.unixTimeConvert(item.time)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-end">
                                        {(item.name === "content parquet" || item.name === "index parquet") &&
                                            <div className="link-button">
                                                <button className="btn text-primary btn-sm"
                                                        onClick={() => inventorizeDump(item.time)}
                                                        title="download as parquet-file" alt="download parquet">Download
                                                    parquet
                                                </button>

                                            </div>
                                        }
                                        {(item.name === "content spreadsheet" || item.name === "indexes spreadsheet") &&
                                            <div className="link-button">
                                                <button className="btn text-primary btn-sm"
                                                        onClick={() => inventorizeDumpSpreadsheet(item.time)}
                                                        title="download as spreadsheet-xlsx"
                                                        alt="download spreadsheet">Download spreadsheet
                                                </button>
                                            </div>
                                        }
                                        <div className="link-button">
                                            <button onClick={() => handleDelete(item)}
                                                    className="btn text-danger btn-sm" title="remove report"
                                                    alt="remove">Remove
                                                report
                                            </button>
                                        </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td/>
                            <td/>
                            <td className={"pt-3 px-4 pb-0"}>
                                <div className="d-flex justify-content-end ">

                                    {selected_organisation_id.length > 0 && !inventorize_busy &&
                                        <button className="btn btn-primary text-nowrap" onClick={() => {
                                            handleCreateDocumentSnapshot();
                                            // forceInventoryBusy();
                                        }}
                                                title="create a new document snapshot">create new document snapshot
                                        </button>
                                    }
                                    {selected_organisation_id.length > 0 && !inventorize_busy &&
                                        <button className="btn btn-primary text-nowrap" onClick={() => {
                                            handleCreateIndexSnapshot();
                                            // forceInventoryBusy();
                                        }} title="create a new index snapshot">create a new
                                            index snapshot
                                        </button>
                                    }
                                    {selected_organisation_id.length > 0 && inventorize_busy &&
                                        <button className="btu btn-secondary disabled"
                                                title="SimSage is currently busy processing an inventory.  Please try again later.">create
                                            new snapshot
                                        </button>
                                    }
                                </div>

                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
            }
            {
                show_delete_form &&
                <InventoryDeleteDialog />
            }

            {
                show_document_snapshot_form &&
                <InventoryDocumentSnapshotPrompt/>

            }

            {
                show_index_snapshot_form &&
                <InventoryIndexSnapshotPrompt />
            }
        </div>
    )
}