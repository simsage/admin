import React, {Component} from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import Api from '../common/api'
import {Pagination} from "../common/pagination";

import '../css/edge.css';



export class EdgeDevices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_edge_device: false,
            edgeDevice: null,

            // edit / create device
            edit_edge_id: "",
            edit_name: "",
            edit_created: 0,

            // viewing ids
            view_ids: false,
            view_ids_edge_device: null,
            copied_visible: '',
            view_ids_edge_map: {},

            // pagination
            page_size: 5,
            page: 0,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    addEdgeDevice() {
        this.setState({edit_edge_device: true, edgeDevice: null,
            edit_edge_id: "",
            edit_name: "",
            edit_created: 0,
        })
    }
    editEdgeDevice(edgeDevice) {
        if (edgeDevice) {
            this.setState({edit_edge_device: true, edgeDevice: edgeDevice,
                edit_edge_id: edgeDevice.edgeId,
                edit_name: edgeDevice.name,
                edit_created: edgeDevice.created,
            })
        }
    }
    deleteEdgeDeviceAsk(edgeDevice) {
        if (edgeDevice) {
            this.props.openDialog("are you sure you want to remove \"" + edgeDevice.name + "\" ?", "Remove Edge device?", (action) => { this.deleteEdgeDevice(action) });
            this.setState({edgeDevice: edgeDevice});
        }
    }
    deleteEdgeDevice(action) {
        if (action) {
            this.props.deleteEdgeDevice(this.props.selected_organisation_id, this.state.edgeDevice.edgeId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_edge_device: false, edgeDevice: null});
    }
    editOk() {
        if (this.state.edit_name.length > 0) {
            this.props.updateEdgeDevice(this.props.selected_organisation_id, this.state.edit_edge_id,
                                           this.state.edit_name, this.state.edit_created);
            this.setState({edit_edge_device: false, edgeDevice: null});
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.");
        }
    }
    viewIds(edge_device) {
        let edge_details = {};
        if (edge_device.details && edge_device.details.length > 2) {
            edge_details = JSON.parse(edge_device.details);
        }
        this.setState({view_ids: true, view_ids_edge_device: edge_device,
                             view_ids_edge_map: edge_details});
    }
    startCopiedVisible(edge_id) {
        this.setState({copied_visible: edge_id});
        window.setTimeout(() => { this.setState({copied_visible: ""})}, 1000);
    }
    getEdgeDevices() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        if (this.props.edge_device_list) {
            for (const i in this.props.edge_device_list) {
                if (i >= first && i < last) {
                    paginated_list.push(this.props.edge_device_list[i]);
                }
            }
        }
        return paginated_list;
    }
    get_edge_details(edge_device) {
        let str = "";
        if (edge_device) {
            if (edge_device.details && edge_device.details.length > 2) {
                const edge_details = JSON.parse(edge_device.details);
                if (edge_details["ipv4"]) {
                    str += "ip v4: " + edge_details["ipv4"];
                }
            }
            if (edge_device.lastModified !== 0) {
                if (str.length > 0) str += ", ";
                str += "last seen: " + Api.unixTimeConvert(edge_device.lastModified);
            }
        }
        if (str === "") {
            return "device not active";
        }
        return str;
    }
    pretty_key(key) {
        if (key) {
            if (key === 'date') {
                return "last seen";
            } else if (key.indexOf('_k') > 0) {
                return key.replace('_k', ' size').replace(/_/g, ' ');
            } else if (key.indexOf('v4') > 0) {
                return key.replace('v4', ' v4').replace(/_/g, ' ');
            } else if (key.indexOf('v6') > 0) {
                return key.replace('v6', ' v6').replace(/_/g, ' ');
            }
        }
        return key.replace(/_/g, ' ');
    }
    pretty_value(key, value) {
        if (key && value) {
            if (key === 'date') {
                return Api.unixTimeConvert(value * 1000);
            }
            if (key.indexOf('_k') > 0) {
                return Api.formatSizeUnits(parseInt(value) * 1000);
            }
        }
        return value;
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
               this.props.selected_organisation && this.props.selected_organisation.length > 0;
    }
    render() {
        const theme = this.props.theme;
        return (
                <div>
                    { this.isVisible() &&

                    <div className="edge-display">

                        <div>
                            <table className="table">
                                <thead>
                                    <tr className='table-header'>
                                        <th className='table-header'>Edge device</th>
                                        <th className='table-header'>remote details</th>
                                        <th className='table-header'>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.getEdgeDevices().map((edge_device) => {
                                            return (
                                                <tr key={edge_device.edgeId}>
                                                    <td>
                                                        <div>{edge_device.name}</div>
                                                    </td>
                                                    <td>
                                                        <div>{this.get_edge_details(edge_device)}</div>
                                                    </td>
                                                    <td>
                                                        <div className="link-button"
                                                             onClick={() => this.viewIds(edge_device)}>
                                                            <img src="../images/id.svg" className="dl-image-size"
                                                                 title="view edge device ids and details" alt="ids"/>
                                                        </div>
                                                        <div className="link-button"
                                                             onClick={() => this.editEdgeDevice(edge_device)}>
                                                            <img src="../images/edit.svg" className="dl-image-size"
                                                                 title="edit edge device" alt="edit"/>
                                                        </div>
                                                        <div className="link-button"
                                                             onClick={() => this.deleteEdgeDeviceAsk(edge_device)}>
                                                            <img src="../images/delete.svg" className="dl-image-size"
                                                                 title="remove edge device" alt="remove"/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td/>
                                        <td/>
                                        <td>
                                            {this.props.selected_organisation_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.addEdgeDevice()}>
                                                <img
                                                    className="dl-image-size" src="../images/add.svg" title="add new Edge device"
                                                    alt="add new Edge device"/></div>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Pagination
                                rowsPerPageOptions={[5, 10, 25]}
                                theme={theme}
                                component="div"
                                count={this.props.edge_device_list ? this.props.edge_device_list.length : 0}
                                rowsPerPage={this.state.page_size}
                                page={this.state.page}
                                backIconButtonProps={{
                                    'aria-label': 'Previous Page',
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'Next Page',
                                }}
                                onChangePage={(page) => this.changePage(page)}
                                onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                            />

                        </div>

                        {
                            this.state.edit_edge_device &&
                            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                                <div className={"modal-dialog modal-dialog-centered modal-md"} role="document">
                                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                                        <div
                                            className="modal-header">{this.state.edit_edge_id ? "Edit Edge device" : "Add New Edge device"}</div>
                                        <div className="modal-body">

                                            <div>name</div>

                                            <input type="text"
                                                   autoFocus={true}
                                                   className="edit-box"
                                                   placeholder="Edge device name"
                                                   value={this.state.edit_name}
                                                   onChange={(event) => this.setState({edit_name: event.target.value})}
                                            />

                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-primary btn-block" onClick={() => this.editCancel()}>Cancel</button>
                                            <button className="btn btn-primary btn-block" onClick={() => this.editOk()}>Save</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        }

                        {
                            this.state.view_ids &&
                            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                                        <div
                                            className="modal-header">{this.state.view_ids_edge_device != null ? this.state.view_ids_edge_device.name : ""} details
                                        </div>
                                        <div className="modal-body">
                                            <div>
                                                <div className="line-height">
                                                    <span className="label-1">organisation id</span>
                                                    <span className="guid">{this.props.selected_organisation_id ? this.props.selected_organisation_id : ""}</span>
                                                    <span className="clipboard" title={'copy organisation id'}>
                                                        <img
                                                            src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                            className="dl-image-size" alt={'copy'}
                                                            onClick={() => {
                                                                if (Api.writeToClipboard(this.props.selected_organisation_id ? this.props.selected_organisation_id : ""))
                                                                    this.startCopiedVisible(this.props.selected_organisation_id);
                                                            }}/>
                                                        {this.props.selected_organisation_id && this.state.copied_visible === this.props.selected_organisation_id &&
                                                        <span className="copied">copied</span>
                                                        }
                                                    </span>
                                                </div>

                                                <div className="line-height">
                                                    <span className="label-1">edge device id</span>
                                                    <span className="guid">{this.state.view_ids_edge_device ? this.state.view_ids_edge_device.edgeId : ""}</span>
                                                    <span className="clipboard" title={'copy Edge device id'}>
                                                        <img
                                                            src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                            className="dl-image-size" alt={'copy'}
                                                            onClick={() => {
                                                                if (Api.writeToClipboard(this.state.view_ids_edge_device ? this.state.view_ids_edge_device.edgeId : ""))
                                                                    this.startCopiedVisible(this.state.view_ids_edge_device.edgeId);
                                                            }}/>
                                                        {this.state.view_ids_edge_device && this.state.copied_visible === this.state.view_ids_edge_device.edgeId &&
                                                            <span className="copied">copied</span>
                                                        }
                                                    </span>
                                                </div>

                                                {
                                                    Object.keys(this.state.view_ids_edge_map).map((key) => {
                                                        return (<div className="line-height" key={key}>
                                                                    <span className="label-1">{this.pretty_key(key)}</span>
                                                                    <span className="guid">{this.pretty_value(key, this.state.view_ids_edge_map[key])}</span>
                                                                </div>);
                                                    })
                                                }

                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-primary btn-block" onClick={() => this.setState({view_ids: false})}>Close
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                }

            </div>
        )
    }
};


const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        edge_device_list: state.appReducer.edge_device_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(EdgeDevices);
