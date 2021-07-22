import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import TablePagination from '@material-ui/core/TablePagination';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Grid from "@material-ui/core/Grid";

import Api from '../common/api'



const styles = {
    pageWidth: {
        width: '900px',
    },
    tableLight: {
    },
    tableDark: {
        background: '#d0d0d0',
    },
    label: {
        color: '#555',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    editBox: {
        width: '500px',
        marginBottom: '15px',
    },
    addImage: {
        width: '25px',
    },
    dlImageSize: {
        width: '24px',
    },
    floatLeft: {
        float: 'left',
    },
    copiedStyle: {
        fontSize: '10px',
        marginLeft: '25px',
        marginTop: '-22px',
        position: 'absolute',
        float: 'left',
        zIndex: '99',
    },
    lineHeight: {height: '30px'},
    organisationIdLabel: {width: '170px', float: 'left', height: '24px'},
    copyImageSpan: {float: 'left', marginTop: '-5px', marginLeft: '10px'},
    clipboardImage: {width: '24px', height: '24px;'},
};


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

                    <div>

                        <Paper style={styles.pageWidth}>
                            <Table>
                                <TableHead>
                                    <TableRow style={styles.tableHeaderStyle}>
                                        <TableCell style={styles.tableHeaderStyle}>Edge device</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>remote details</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={theme === 'light' ? styles.tableLight : styles.tableDark}>
                                    {
                                        this.getEdgeDevices().map((edge_device) => {
                                            return (
                                                <TableRow key={edge_device.edgeId}>
                                                    <TableCell>
                                                        <div style={styles.label}>{edge_device.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label}>{this.get_edge_details(edge_device)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.viewIds(edge_device)}>
                                                            <img src="../images/id.svg" style={styles.dlImageSize}
                                                                 title="view Edge device ids and details" alt="ids"/>
                                                        </div>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.editEdgeDevice(edge_device)}>
                                                            <img src="../images/edit.svg" style={styles.dlImageSize}
                                                                 title="edit Edge device" alt="edit"/>
                                                        </div>
                                                        <div style={styles.linkButton}
                                                             onClick={() => this.deleteEdgeDeviceAsk(edge_device)}>
                                                            <img src="../images/delete.svg" style={styles.dlImageSize}
                                                                 title="remove Edge device" alt="remove"/>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell>
                                            {this.props.selected_organisation_id.length > 0 &&
                                            <div style={styles.imageButton} onClick={() => this.addEdgeDevice()}>
                                                <img
                                                    style={styles.addImage} src="../images/add.svg" title="add new Edge device"
                                                    alt="add new Edge device"/></div>
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                style={theme === 'light' ? styles.tableLight : styles.tableDark}
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
                                onChangePage={(event, page) => this.changePage(page)}
                                onChangeRowsPerPage={(event) => this.changePageSize(event.target.value)}
                            />

                        </Paper>


                        <Dialog aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                open={this.state.edit_edge_device}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                fullWidth={true}
                                maxWidth="lg"
                                onClose={() => this.setState({edit_edge_device: false, edgeDevice: null})}>
                            <DialogTitle className={this.props.theme}>{this.state.edit_edge_id ? "Edit Edge device" : "Add New Edge device"}</DialogTitle>
                            <DialogContent className={this.props.theme}>

                                <Grid container spacing={2}>

                                    <Grid item xs={1}/>
                                    <Grid item xs={3}>
                                        <div>name</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            autoFocus={true}
                                            style={styles.editBox}
                                            placeholder="Edge device name"
                                            value={this.state.edit_name}
                                            onChange={(event) => this.setState({edit_name: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}/>

                                </Grid>

                            </DialogContent>
                            <DialogActions className={this.props.theme}>
                                <Button color="primary" onClick={() => this.editCancel()}>Cancel</Button>
                                <Button variant="outlined" color="secondary" onClick={() => this.editOk()}>Save</Button>
                            </DialogActions>
                        </Dialog>


                        <Dialog aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                open={this.state.view_ids}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                fullWidth={true}
                                maxWidth="md"
                                onClose={() => this.setState({view_ids: false})} >
                            <DialogTitle className={this.props.theme}>{this.state.view_ids_edge_device != null ? this.state.view_ids_edge_device.name : ""} details</DialogTitle>
                            <DialogContent className={this.props.theme}>
                                <div>
                                    <div style={styles.lineHeight}>
                                        <div style={styles.organisationIdLabel}>
                                            organisation id
                                        </div>
                                        <div style={styles.floatLeft}>{this.props.selected_organisation_id ? this.props.selected_organisation_id : ""}</div>
                                        <span style={styles.copyImageSpan} title={'copy organisation id'}>
                                        <img src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'} style={styles.clipboardImage} alt={'copy'}
                                                 onClick={() => { if (Api.writeToClipboard(this.props.selected_organisation_id ? this.props.selected_organisation_id : ""))
                                                     this.startCopiedVisible(this.props.selected_organisation_id);
                                                 }}/>
                                                    {this.props.selected_organisation_id && this.state.copied_visible === this.props.selected_organisation_id &&
                                                    <div style={styles.copiedStyle}>copied</div>
                                                    }
                                        </span>
                                        <br clear='both' />
                                    </div>

                                    <div style={styles.lineHeight}>
                                        <div style={styles.organisationIdLabel}>
                                            Edge device id
                                        </div>
                                        <div style={styles.floatLeft}>{this.state.view_ids_edge_device ? this.state.view_ids_edge_device.edgeId : ""}</div>
                                        <span style={styles.copyImageSpan} title={'copy Edge device id'}>
                                            <img src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'} style={styles.clipboardImage} alt={'copy'}
                                                 onClick={() => { if (Api.writeToClipboard(this.state.view_ids_edge_device ? this.state.view_ids_edge_device.edgeId : ""))
                                                     this.startCopiedVisible(this.state.view_ids_edge_device.edgeId);
                                                 }}/>
                                                    {this.state.view_ids_edge_device && this.state.copied_visible === this.state.view_ids_edge_device.edgeId &&
                                                    <div style={styles.copiedStyle}>copied</div>
                                                    }
                                        </span>
                                        <br clear='both' />
                                    </div>

                                    {
                                        Object.keys(this.state.view_ids_edge_map).map((key) => {
                                            return (<div style={styles.lineHeight} key={key}>
                                                        <div style={styles.organisationIdLabel}>{this.pretty_key(key)}</div>
                                                        <div style={styles.floatLeft}>{this.pretty_value(key, this.state.view_ids_edge_map[key])}</div>
                                                    </div>);
                                        })
                                    }

                                </div>
                            </DialogContent>
                            <DialogActions className={this.props.theme}>
                                <Button variant="outlined" color="secondary" onClick={() => this.setState({view_ids: false})}>Close</Button>
                            </DialogActions>
                        </Dialog>


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
        edge_device_list: state.appReducer.edge_device_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(EdgeDevices);
