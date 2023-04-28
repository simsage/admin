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
import {Pagination} from "../../common/pagination";
import api from "../../common/api";


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
    const num_inventory_list_items = inventory_list.timeList ? inventory_list.timeList.length : 0
    console.log('TestingMax', num_inventory_list_items, inventory_list.timeList.length)
    const data_status = useSelector((state) => state.inventoryReducer.data_status);
    const [error, setError] = useState('')

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);


    useEffect(() => {
        console.log("Inventory useEffect")
        dispatch(loadInventoryList({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))

    }, [data_status === 'load_now', props.tab, selected_knowledge_base_id])

    //TODO::inventorize_busy
    const inventorize_busy = false;


    function getList() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        const list = inventory_list.timeList;
        // const list = organisation_list != null ? organisation_list : organisation_original_list;
        for (const i in list) {
            if (i >= first && i < last) {
                paginated_list.push(inventory_list.timeList[i]);
            }
        }
        return paginated_list;
    }


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

            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">


                </div>
                <div className="form-group ms-auto">
                    {selected_knowledge_base_id.length > 0 &&
                        <div className="d-flex">
                            {selected_organisation_id.length > 0 && !inventorize_busy &&
                                <button className="btn btn-primary text-nowrap ms-2" onClick={() => {
                                    handleCreateDocumentSnapshot();
                                    // forceInventoryBusy();
                                }}
                                        title="create a new document snapshot">New Document Snapshot
                                </button>
                            }
                            {selected_organisation_id.length > 0 && !inventorize_busy &&
                                <button className="btn btn-primary text-nowrap ms-2" onClick={() => {
                                    handleCreateIndexSnapshot();
                                    // forceInventoryBusy();
                                }} title="create a new index snapshot">New
                                    Index Snapshot
                                </button>
                            }
                            {selected_organisation_id.length > 0 && inventorize_busy &&
                                <button className="btu btn-secondary disabled ms-2"
                                        title="SimSage is currently busy processing an inventory.  Please try again later.">Create
                                    new snapshot
                                </button>
                            }
                        </div>
                    }

                </div>
            </div>
            {isVisible() && 
                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <td className='small text-black-50 px-4'>Type</td>
                            <td className='small text-black-50 px-4'>Created</td>
                            <td className='small text-black-50 px-4'></td>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{inventory_list && inventory_list.timeList && inventory_list.timeList.map((item, i) => {*/}
                        { inventory_list && inventory_list.timeList && getList().map((item,i) => {
                            return (
                                <tr key={i}>
                                    <td className="pt-3 px-4 pb-3">
                                        <div className="snapshot-item">
                                            {itemNameToDescription(item.name)}
                                        </div>
                                    </td>
                                    <td className="pt-3 px-4 pb-3 fw-light">
                                        <div className="snapshot-item">
                                            {Api.unixTimeConvert(item.time)}
                                        </div>
                                    </td>
                                    <td className="pt-3 px-4 pb-0">
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
                                            </button>
                                        </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={num_inventory_list_items}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rows) => setPageSize(rows)}
                    />
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