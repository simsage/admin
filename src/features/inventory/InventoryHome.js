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
import InventorySuccessMessage from "./InventorySuccessMessage";


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
    const show_add_info_form = useSelector((state) => state.inventoryReducer.show_add_info_form)

    const inventory_list = useSelector((state) => state.inventoryReducer.inventory_list);
    const num_inventory_list_items = inventory_list.timeList ? inventory_list.timeList.length : 0

    const data_status = useSelector((state) => state.inventoryReducer.data_status);
    // const [error, setError] = useState('')

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    useEffect(() => {
        dispatch(loadInventoryList({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data_status === 'load_now', props.tab,
             selected_knowledge_base_id, selected_organisation_id, session_id])

    function refresh_inventory() {
        dispatch(loadInventoryList({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))
    }

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

    function isVisible() {
        return selected_organisation_id && selected_organisation_id.length > 0 &&
            selected_organisation && selected_organisation.length > 0 &&
            selected_knowledge_base_id && selected_knowledge_base_id.length > 0;
    }

    function item_name_to_description(name) {
        if (name === "content parquet")
            return "Content analysis Parquet file";
        else if (name === "indexes parquet" || name === 'index parquet')
            return "Index analysis Parquet file";
        else return name;
    }

    function handleCreateDocumentSnapshot() {
        dispatch(showDocumentSnapshotForm())
    }

    function handleCreateIndexSnapshot() {
        dispatch(showIndexSnapshotForm())
    }

    function handleDelete(inventory) {
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
                            {selected_organisation_id.length > 0 &&
                                <div className="btn" onClick={() => refresh_inventory()} >
                                    <img src="images/refresh.svg" className="refresh-image" alt="refresh" title="refresh inventory-list" />
                                </div>
                            }
                            {selected_organisation_id.length > 0 &&
                                <button className="btn btn-primary text-nowrap ms-2" onClick={() => {
                                    handleCreateDocumentSnapshot();
                                }} title="create a new document snapshot">New Document Snapshot
                                </button>
                            }
                            {selected_organisation_id.length > 0 &&
                                <button className="btn btn-primary text-nowrap ms-2" onClick={() => {
                                    handleCreateIndexSnapshot();
                                }} title="create a new index snapshot">New Index Snapshot
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
                                            {item_name_to_description(item.name)}
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
                                                        title="download as parquet-file">Download parquet
                                                </button>

                                            </div>
                                        }
                                        {(item.name === "content spreadsheet" || item.name === "indexes spreadsheet") &&
                                            <div className="link-button">
                                                <button className="btn text-primary btn-sm"
                                                        onClick={() => inventorizeDumpSpreadsheet(item.time)}
                                                        title="download as spreadsheet-xlsx">Download spreadsheet
                                                </button>
                                            </div>
                                        }
                                        <div className="link-button">
                                            <button onClick={() => handleDelete(item)}
                                                    className="btn text-danger btn-sm" title="remove report">Remove
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

            {
                (show_add_info_form === 'index' || show_add_info_form === 'doc') &&
                <InventorySuccessMessage/>
            }
        </div>
    )
}