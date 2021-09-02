import React, {Component} from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import Api from '../common/api'
import {Pagination} from "../common/pagination";

import '../css/edge.css';



export class EdgeDeviceCommands extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // edit / create device
            edit_edge_device_cmd: false,
            created: 0,
            edit_command: "",
            edit_parameters: "",
            edc: null,

            // result viewer for commands
            view_results: false,
            command: "",
            results: [],

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
    addEdgeDeviceCommand() {
        this.setState({edit_edge_device_cmd: true, edc: null,
            created: 0,
            edit_command: "",
            edit_parameters: "",
        })
    }
    editEdgeDeviceCommand(edc) {
        if (edc) {
            this.setState({edit_edge_device_cmd: true, edgeDeviceCommand: edc,
                created: edc.created,
                edit_command: edc.command,
                edit_parameters: edc.parameters,
            })
        }
    }
    deleteEdgeDeviceCommandAsk(edc) {
        if (edc) {
            this.props.openDialog("are you sure you want to remove \"" + edc.command + "\" ?", "Remove Edge device command?",
                                    (action) => { this.deleteEdgeDeviceCommand(action) });
            this.setState({edc: edc});
        }
    }
    deleteEdgeDeviceCommand(action) {
        if (action && this.state.edc) {
            this.props.deleteEdgeDeviceCommand(this.props.selected_organisation_id, this.props.selected_edge_device_id,
                                               this.state.edc.created);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_edge_device_cmd: false, edc: null});
    }
    editOk() {
        if (this.state.edit_command.trim().length > 0) {
            this.props.updateEdgeDeviceCommand(this.props.selected_organisation_id, this.props.selected_edge_device_id,
                                               this.state.edit_command, this.state.edit_parameters, this.state.created);
            this.setState({edit_edge_device_cmd: false, edc: null, created: 0, edit_command: '', edit_parameters: ''});
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.");
        }
    }
    getEdgeDeviceCommands() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        if (this.props.edge_device_command_list) {
            for (const i in this.props.edge_device_command_list) {
                if (i >= first && i < last) {
                    paginated_list.push(this.props.edge_device_command_list[i]);
                }
            }
        }
        return paginated_list;
    }
    getExecutedStatus(executed) {
        if (executed > 0) {
            return Api.unixTimeConvert(executed);
        }
        return "queued";
    }
    isVisible() {
        return this.props.selected_edge_device_id && this.props.selected_edge_device_id.length > 0 &&
               this.props.selected_edge_device && this.props.selected_edge_device.length > 0;
    }
    viewResult(edc) {
        if (edc && edc.result) {
            this.setState({view_results: true, results: edc.result.split("\n"), command: edc.command + " " + edc.parameters});
        }
    }
    render() {
        const theme = this.props.theme;
        return (
                <div className="edge-display">
                    { this.isVisible() &&

                    <div>

                        <div>
                            <table className="table">
                                <thead>
                                    <tr className='table-header'>
                                        <th className='table-header'>Edge command</th>
                                        <th className='table-header'>created</th>
                                        <th className='table-header'>executed</th>
                                        <th className='table-header'>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.getEdgeDeviceCommands().map((edc) => {
                                            return (
                                                <tr key={edc.created}>
                                                    <td>
                                                        <div>{edc.command}</div>
                                                    </td>
                                                    <td>
                                                        <div>{Api.unixTimeConvert(edc.created)}</div>
                                                    </td>
                                                    <td>
                                                        <div>{this.getExecutedStatus(edc.executed)}</div>
                                                    </td>
                                                    <td>
                                                        { edc.executed === 0 &&
                                                            <div className="link-button"
                                                                 onClick={() => this.editEdgeDeviceCommand(edc)}>
                                                                <img src="../images/edit.svg" className="dl-image-size"
                                                                     title="edit Edge device" alt="edit"/>
                                                            </div>
                                                        }
                                                        { edc.executed === 0 &&
                                                            <div className="link-button"
                                                                 onClick={() => this.deleteEdgeDeviceCommandAsk(edc)}>
                                                                <img src="../images/delete.svg" className="dl-image-size"
                                                                     title="remove Edge device" alt="remove"/>
                                                            </div>
                                                        }
                                                        { edc.executed > 0 &&
                                                            <div className="link-button"
                                                                 onClick={() => this.viewResult(edc)}>
                                                                <img src="../images/edit.svg" className="dl-image-size"
                                                                     title="view command result" alt="view"/>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td/>
                                        <td/>
                                        <td/>
                                        <td>
                                            {this.props.selected_edge_device_id.length > 0 &&
                                            <div className="edge-float-right" onClick={() => this.addEdgeDeviceCommand()}>
                                                <img
                                                    className="dl-image-size" src="../images/add.svg" title="add new Edge device command"
                                                    alt="add new Edge device command"/></div>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Pagination
                                rowsPerPageOptions={[5, 10, 25]}
                                theme={theme}
                                component="div"
                                count={this.props.edge_device_command_list ? this.props.edge_device_command_list.length : 0}
                                rowsPerPage={this.state.page_size}
                                page={this.state.page}
                                onChangePage={(page) => this.changePage(page)}
                                onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                            />

                        </div>


                        {this.state.edit_edge_device_cmd &&
                        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                            <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                                <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                                    <div
                                        className="modal-header">{this.state.created ? "Edit Edge device command" : "Add New Edge device command"}</div>
                                    <div className="modal-body">

                                        <div>

                                            <div className="control-row">
                                                <span className="label-2">command</span>
                                                <span className="text">
                                                    <input type="text" className="form-control"
                                                           autoFocus={true}
                                                           placeholder="command"
                                                           value={this.state.edit_command}
                                                           onChange={(event) => this.setState({edit_command: event.target.value})}
                                                    />
                                                </span>
                                            </div>

                                            <div className="control-row">
                                                <span className="label-2">parameters</span>
                                                <span className="text">
                                                    <input type="text" className="form-control"
                                                       placeholder="command parameters"
                                                       value={this.state.edit_parameters}
                                                       onChange={(event) => this.setState({edit_parameters: event.target.value})}
                                                    />
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-primary btn-block" onClick={() => this.editCancel()}>Cancel</button>
                                        <button className="btn btn-primary btn-block" onClick={() => this.editOk()}>Save</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        }


                        {this.state.view_results &&
                        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                            <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                                <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                                    <div className="modal-header">results</div>
                                    <div className="modal-body">
                                        <div>
                                            <div className="command-item">{this.state.command}</div>
                                            {
                                                this.state.results.map((result, index) => {
                                                    return (
                                                        <div key={index} className="result-item">
                                                            {result}
                                                        </div>
                                                    )
                                                })
                                            }
                                            <br clear='both'/>

                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-primary btn-block"
                                                onClick={() => this.setState({view_results: false})}>Close
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
}


const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,

        selected_edge_device_id: state.appReducer.selected_edge_device_id,
        selected_edge_device: state.appReducer.selected_edge_device,

        edge_device_list: state.appReducer.edge_device_list,
        edge_device_command_list: state.appReducer.edge_device_command_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(EdgeDeviceCommands);
