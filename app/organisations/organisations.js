import React from 'react';

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

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    tableWidth: {
        width: '750px'
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
    roleBlock: {
        padding: '5px',
        marginTop: '20px',
        float: 'left',
        width: '400px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    roleLabel: {
        fontSize: '0.8em',
        color: '#aaa',
    },
    roleArea: {
        padding: '20px',
    },
    roleChip: {
        margin: '2px',
    },
    addImage: {
        width: '25px',
    },
    textFieldBox: {
        float: 'left',
    },
    imageBox: {
        float: 'left',
    },
    imageSize: {
        marginTop: '20px',
        width: '20px',
    },
    dlImageSize: {
        width: '24px',
    },
};


export class Organisations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_organisation: false,
            edit_organisation_id: "",
            edit_name: "",
            organisation: null,
            // pagination
            page_size: 5,
            page: 0,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    addNewOrganisation() {
        this.setState({edit_organisation: true,
                             organisation: null,
                             edit_organisation_id: "",
                             edit_name: ""})
    }
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
    }
    editOrganisation(organisation) {
        if (organisation) {
            this.setState({edit_organisation: true,
                                 organisation: organisation,
                                 edit_organisation_id: organisation.id,
                                 edit_name: organisation.name})
        }
    }
    deleteOrganisationAsk(organisation) {
        if (organisation && this.props.openDialog) {
            this.props.openDialog("are you sure you want to remove \"" + organisation.name + "\" ?",
                                  "Remove Organisation", (action) => { this.deleteOrganisation(action) });
            this.setState({organisation: organisation})
        }
    }
    deleteOrganisation(action) {
        if (action) {
            this.props.deleteOrganisation(this.state.organisation.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_organisation: false, organisation: null});
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getOrganisations() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        for (const i in this.props.organisation_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.organisation_list[i]);
            }
        }
        return paginated_list;
    }
    editOk() {
        if (this.state.edit_name.length > 0) {
            this.props.updateOrganisation(this.state.edit_organisation_id, this.state.edit_name);
            this.setState({edit_organisation: false, organisation: null});
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.  Must have a name.");
        }
    }
    render() {
        return (
            <div>
                <Paper>
                    <Table style={styles.tableWidth}>
                        <TableHead>
                            <TableRow style={styles.tableHeaderStyle}>
                                <TableCell style={styles.tableHeaderStyle}>organisation</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.getOrganisations().map((organisation) => {
                                    return (
                                        <TableRow key={organisation.id}>
                                            <TableCell>
                                                <div style={styles.label}>{organisation.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.linkButton} onClick={() => this.editOrganisation(organisation)}>
                                                    <img src="../images/edit.svg" style={styles.dlImageSize} title="edit organisation" alt="edit"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.deleteOrganisationAsk(organisation)}>
                                                    <img src="../images/delete.svg" style={styles.dlImageSize} title="remove organisation" alt="remove"/>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    <a style={styles.imageButton} onClick={() => this.addNewOrganisation()}><img
                                        style={styles.addImage} src="../images/add.svg" title="add new organisation"
                                        alt="add new organisation"/></a>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.organisation_list.length}
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
                        open={this.state.edit_organisation}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={() => this.setState({edit_organisation: false, organisation: null})} >
                    <DialogTitle>{this.state.edit_organisation_id ? "Edit Organisation" : "Add New Organisation"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={true}
                            style={styles.editBox}
                            placeholder="organisation name"
                            label="organisation name"
                            value={this.state.edit_name}
                            onChange = {(event) => this.setState({edit_name: event.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.editCancel()}>Cancel</Button>
                        <Button variant="outlined" color="secondary" onClick={() => this.editOk()}>Save</Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        organisation_list: state.appReducer.organisation_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Organisations);

