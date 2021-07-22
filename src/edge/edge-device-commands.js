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
        width: '100%',
        marginBottom: '15px',
    },
    addImage: {
        width: '25px',
    },
    dlImageSize: {
        width: '24px',
    },
    commandItem: {
        fontWeight: '600',
        marginBottom: '20px',
    },
    resultItem: {
        fontSize: '10px',
    }
};


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
                <div>
                    { this.isVisible() &&

                    <div>

                        <Paper style={styles.pageWidth}>
                            <Table>
                                <TableHead>
                                    <TableRow style={styles.tableHeaderStyle}>
                                        <TableCell style={styles.tableHeaderStyle}>Edge command</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>created</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>executed</TableCell>
                                        <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={theme === 'light' ? styles.tableLight : styles.tableDark}>
                                    {
                                        this.getEdgeDeviceCommands().map((edc) => {
                                            return (
                                                <TableRow key={edc.created}>
                                                    <TableCell>
                                                        <div style={styles.label}>{edc.command}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label}>{Api.unixTimeConvert(edc.created)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.label}>{this.getExecutedStatus(edc.executed)}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        { edc.executed === 0 &&
                                                            <div style={styles.linkButton}
                                                                 onClick={() => this.editEdgeDeviceCommand(edc)}>
                                                                <img src="../images/edit.svg" style={styles.dlImageSize}
                                                                     title="edit Edge device" alt="edit"/>
                                                            </div>
                                                        }
                                                        { edc.executed === 0 &&
                                                            <div style={styles.linkButton}
                                                                 onClick={() => this.deleteEdgeDeviceCommandAsk(edc)}>
                                                                <img src="../images/delete.svg" style={styles.dlImageSize}
                                                                     title="remove Edge device" alt="remove"/>
                                                            </div>
                                                        }
                                                        { edc.executed > 0 &&
                                                            <div style={styles.linkButton}
                                                                 onClick={() => this.viewResult(edc)}>
                                                                <img src="../images/edit.svg" style={styles.dlImageSize}
                                                                     title="view command result" alt="view"/>
                                                            </div>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell/>
                                        <TableCell>
                                            {this.props.selected_edge_device_id.length > 0 &&
                                            <div style={styles.imageButton} onClick={() => this.addEdgeDeviceCommand()}>
                                                <img
                                                    style={styles.addImage} src="../images/add.svg" title="add new Edge device command"
                                                    alt="add new Edge device command"/></div>
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                style={theme === 'light' ? styles.tableLight : styles.tableDark}
                                component="div"
                                count={this.props.edge_device_command_list ? this.props.edge_device_command_list.length : 0}
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
                                open={this.state.edit_edge_device_cmd}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                fullWidth={true}
                                maxWidth="lg"
                                onClose={() => this.setState({edit_edge_device_cmd: false})}>
                            <DialogTitle className={this.props.theme}>{this.state.created ? "Edit Edge device command" : "Add New Edge device command"}</DialogTitle>
                            <DialogContent className={this.props.theme}>

                                <Grid container spacing={2}>

                                    <Grid item xs={1}/>
                                    <Grid item xs={1}>
                                        <div>command</div>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            autoFocus={true}
                                            style={styles.editBox}
                                            placeholder="command"
                                            value={this.state.edit_command}
                                            onChange={(event) => this.setState({edit_command: event.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}/>

                                    <Grid item xs={1}/>
                                    <Grid item xs={1}>
                                        <div>parameters</div>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            style={styles.editBox}
                                            placeholder="command parameters"
                                            value={this.state.edit_parameters}
                                            onChange={(event) => this.setState({edit_parameters: event.target.value})}
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
                                open={this.state.view_results}
                                disableBackdropClick={true}
                                disableEscapeKeyDown={true}
                                fullWidth={true}
                                maxWidth="md"
                                onClose={() => this.setState({view_results: false})} >
                            <DialogTitle className={this.props.theme}>results</DialogTitle>
                            <DialogContent className={this.props.theme}>
                                <div>
                                    <div style={styles.commandItem}>{this.state.command}</div>
                                    {
                                        this.state.results.map((result, index) => {
                                            return (
                                                <div key={index} style={styles.resultItem}>
                                                    {result}
                                                </div>
                                            )
                                        })
                                    }
                                    <div style={styles.lineHeight}>
                                        <br clear='both' />
                                    </div>

                                </div>
                            </DialogContent>
                            <DialogActions className={this.props.theme}>
                                <Button variant="outlined" color="secondary" onClick={() => this.setState({view_results: false})}>Close</Button>
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
