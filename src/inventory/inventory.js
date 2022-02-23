import React from 'react';

import Comms from '../common/comms';
import Api from '../common/api';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/inventory.css';


export class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date_time: 0,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
    }
    programConverted(program) {
        if (program) {
            window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
        }
    }
    inventorizeDump(dateTime) {
        if (this.props.session && this.props.session.id)
            Comms.download_inventorize_dump(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, dateTime, this.props.session.id);
    }
    inventorizeDumpSpreadsheet(dateTime) {
        if (this.props.session && this.props.session.id)
            Comms.download_inventorize_dump_spreadhseet(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, dateTime, this.props.session.id);
    }
    deleteInventorizeAsk(dateTime) {
        this.setState({date_time: dateTime});
        this.props.openDialog("are you sure you want to remove the report dated <b>" + Api.unixTimeConvert(dateTime) + "</b>?",
            "Remove Inventory Report", (action) => { this.deleteReport(action) });
    }
    deleteReport(action) {
        if (action) {
            this.props.deleteInventoryItem(this.state.date_time);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    restore(data) {
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
                    this.props.setError("Error", errStr);
                })
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    itemNameToDescription(name) {
        if (name === "content spreadsheet")
            return "Content analysis SpreadSheet";
        else if (name === "content parquet")
            return "Content analysis Parquet file";
        else if (name === "indexes parquet")
            return "Index analysis Parquet file";
        else if (name === "indexes spreadsheet")
            return "Index analysis SpreadSheet";
    }
    render() {
        const theme = this.props.theme;
        return (
            <div className="inventory-page">

                {this.isVisible() &&
                    <div className={theme === 'light' ? "hr" : "hr_dark"} />
                }

                {this.isVisible() &&

                    <div className="inventory-label">Manage snapshots of your document inventory.
                        {this.props.inventorize_busy &&
                            <span>  SimSage is busy creating a new snapshot.</span>
                        }
                        {this.props.selected_organisation_id.length > 0 &&
                        <img src="../images/refresh.svg" alt="refresh"
                             title="refresh the inventory list"
                             onClick={() => {
                                 this.props.getInventoryList();
                                 this.props.getInventoryBusy();
                             }}
                             className="refresh-image" />
                        }
                    </div>
                }

                {this.isVisible() &&
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
                                { this.props.inventorize_list && this.props.inventorize_list.timeList && this.props.inventorize_list.timeList.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div className="snapshot-item">
                                                    { this.itemNameToDescription(item.name) }
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
                                                     onClick={() => this.inventorizeDump(item.time)}>
                                                    <img src="../images/parquet.png" className="image-size"
                                                         title="download as parquet-file" alt="download parquet"/>
                                                </div>
                                                }
                                                { (item.name === "content spreadsheet" || item.name === "indexes spreadsheet") &&
                                                <div className="link-button"
                                                     onClick={() => this.inventorizeDumpSpreadsheet(item.time)}>
                                                    <img src="../images/xlsx.svg" className="image-size"
                                                         title="download as spreadsheet-xlsx"
                                                         alt="download spreadsheet"/>
                                                </div>
                                                }
                                                <div className="link-button" onClick={() => this.deleteInventorizeAsk(item.time)}>
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
                                        {this.props.selected_organisation_id.length > 0 && !this.props.inventorize_busy &&
                                        <div className="image-button" onClick={() => {
                                            this.props.createInventory();
                                            this.props.forceInventoryBusy();
                                        }}><img className="image-size" src="../images/add.svg" title="create a new document snapshot" alt="create new document snapshot"/>&nbsp;documents</div>
                                        }
                                        {this.props.selected_organisation_id.length > 0 && !this.props.inventorize_busy &&
                                        <div className="image-button" onClick={() => {
                                            this.props.createIndexInventory();
                                            this.props.forceInventoryBusy();
                                        }}><img className="image-size" src="../images/add.svg" title="create a new index snapshot" alt="create new index snapshot"/>&nbsp;indexes</div>
                                        }
                                        {this.props.selected_organisation_id.length > 0 && this.props.inventorize_busy &&
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
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        inventorize_list: state.appReducer.inventorize_list,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        inventorize_busy: state.appReducer.inventorize_busy,
        session: state.appReducer.session,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Inventory);

