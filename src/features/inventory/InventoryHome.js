import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {Pagination} from "../../common/pagination";
import db from "../../notes/db.json";
import Comms from "../../common/comms";


export default function InventoryHome(){
    const title = "Inventory";
    const theme = '';
    const selected_organisation = "ORg1"

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    const [inventory_list, setInventoryList]  = useState({});
    const [error, setError] = useState('')


    //TODO::inventorize_busy
    const inventorize_busy = false;
    //TODO::
    function isVisible(){
        return true;
    }

    function componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    function componentDidMount() {
    }
    function programConverted(program) {
        if (program) {
            window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
        }
    }
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
            "Remove Inventory Report", (action) => { deleteReport(action) });
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
                    this.setState({uploading: false,
                        message_title: "Success",
                        message: "data restored",
                        message_callback: () => { this.setState({message: "", message_title: ""})}
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
        else if (name === "indexes parquet")
            return "Index analysis Parquet file";
        else if (name === "indexes spreadsheet")
            return "Index analysis SpreadSheet";
    }

    //todo::getInventoryList
    function getInventoryList(){
       console.log("refresh the inventory list")
    }

    //todo::getInventoryBusy
    function getInventoryBusy(){
        console.log("refresh the inventory list")
    }


    //todo::createInventory
    function createInventory(){
        console.log("createInventory list")
    }

    //todo::forceInventoryBusy
    function forceInventoryBusy(){
        console.log("forceInventoryBusy")
    }

    //todo::createIndexInventory
    function createIndexInventory(){
        console.log("createIndexInventory")
    }



    return(
        <div className="section px-5 pt-4">
                {isVisible() &&
                <div className={theme === 'light' ? "hr" : "hr_dark"} />
                }

                {isVisible() &&

                <div className="inventory-label">Manage snapshots of your document inventory.
                    {inventorize_busy &&
                    <span>  SimSage is busy creating a new snapshot.</span>
                    }
                    {selected_organisation_id.length > 0 &&
                    <img src="../images/refresh.svg" alt="refresh"
                         title="refresh the inventory list"
                         onClick={() => {
                             getInventoryList();
                             getInventoryBusy();
                         }}
                         className="refresh-image" />
                    }
                </div>
                }

                {isVisible() &&
                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <th className='table-header table-width-25'>type</th>
                            <th className='table-header table-width-33'>created</th>
                            <th className='table-header'>action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventory_list.length}
                        { inventory_list && inventory_list.timeList && inventory_list.timeList.map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="snapshot-item">
                                            { itemNameToDescription(item.name) }
                                        </div>
                                    </td>
                                    <td>
                                        <div className="snapshot-item">
                                            {Api.unixTimeConvert(item.time)}
                                        </div>
                                    </td>
                                    <td>
                                        { (item.name === "content parquet" || item.name === "indexes parquet") &&
                                        <div className="link-button"
                                             onClick={() => inventorizeDump(item.time)}>
                                            <img src="../images/parquet.png" className="image-size"
                                                 title="download as parquet-file" alt="download parquet"/>
                                        </div>
                                        }
                                        { (item.name === "content spreadsheet" || item.name === "indexes spreadsheet") &&
                                        <div className="link-button"
                                             onClick={() => inventorizeDumpSpreadsheet(item.time)}>
                                            <img src="../images/xlsx.svg" className="image-size"
                                                 title="download as spreadsheet-xlsx"
                                                 alt="download spreadsheet"/>
                                        </div>
                                        }
                                        <div className="link-button" onClick={() => deleteInventorizeAsk(item.time)}>
                                            <img src="../images/delete.svg" className="image-size" title="remove report" alt="remove"/>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td/>
                            <td/>
                            <td>
                                {selected_organisation_id.length > 0 && !inventorize_busy &&
                                <div className="image-button" onClick={() => {
                                    createInventory();
                                    forceInventoryBusy();
                                }}><img className="image-size" src="../images/add.svg" title="create a new document snapshot" alt="create new document snapshot"/>&nbsp;documents</div>
                                }
                                {selected_organisation_id.length > 0 && !inventorize_busy &&
                                <div className="image-button" onClick={() => {
                                    createIndexInventory();
                                    forceInventoryBusy();
                                }}><img className="image-size" src="../images/add.svg" title="create a new index snapshot" alt="create new index snapshot"/>&nbsp;indexes</div>
                                }
                                {selected_organisation_id.length > 0 && inventorize_busy &&
                                <div className="image-button">
                                    <img className="image-size add-image-disabled" src="../images/add.svg" title="SimSage is currently busy processing an inventory.  Please try again later." alt="create new snapshot"/>
                                </div>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>

                </div>
                }

        </div>
    )
}