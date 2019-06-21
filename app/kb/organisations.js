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
import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'

const id_style = "<div style='width: 170px; float: left; height: 24px;'>"

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
};


export class Organisations extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            edit_organisation: false,
            organisation: null,

            edit_organisation_id: "",
            edit_name: "",

            error_msg: "",
            error_title: "",

            message_title: "",
            message: "",
            message_callback: null,

            // pagination
            page_size: 5,
            page: 0,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentWillReceiveProps(props) {
        this.kba = props.kba;
    }
    componentDidMount() {
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    addNewOrganisation() {
        this.setState({edit_organisation: true, organisation: null,
            edit_organisation_id: "",
            edit_name: "",
        })
    }
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
    }
    editOrganisation(organisation) {
        if (organisation) {
            this.setState({edit_organisation: true, organisation: organisation,
                edit_organisation_id: organisation.id,
                edit_name: organisation.name,
            })
        }
    }
    deleteOrganisationAsk(organisation) {
        if (organisation) {
            this.setState({message_title: "Remove Organisation",
                message_callback: (action) => { this.deleteOrganisation(action) },
                message: "are you sure you want to remove \"" + organisation.name + "\" ?",
                organisation: organisation})
        }
    }
    deleteOrganisation(action) {
        if (action) {
            Api.deleteOrganisation(this.state.organisation.id, () => {
                this.setState({message_title: "", message: ""});
                this.kba.deleteOrganisation(this.state.organisation.id, this.state.page, this.state.page_size);
            }, (errStr) => {
                this.setState({message_title: "", message: "",
                    error_msg: errStr, error_title: "Error Removing Organisation"});
            })
        } else {
            this.setState({message_title: "", message: ""});
        }
    }
    editCancel() {
        this.setState({edit_organisation: false, organisation: null})
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
        this.kba.getOrganisationList(this.state.page, page_size);
    }
    editOk() {
        if (this.state.edit_name.length > 0) {

            Api.updateOrganisation(this.state.edit_organisation_id, this.state.edit_name,
                (data) => {
                    this.setState({edit_organisation: false, organisation: null});
                    this.kba.getOrganisationList(this.state.page, this.state.page_size);
                },
                (errStr) => {
                    this.setState({edit_organisation: false, error_msg: errStr, error_title: "Error Updating Organisation"});
                });
        } else {
            this.setState({
                error_msg: "Please complete all fields.  Must have a name.",
                error_title: "Incomplete Data"});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>organisations.js: Something went wrong.</h1>;
        }
        return (
            <div>
                <ErrorDialog
                    callback={() => { this.closeError() }}
                    open={this.state.error_msg.length > 0}
                    message={this.state.error_msg}
                    title={this.state.error_title} />

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

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
                                this.kba.organisation_list.map((organisation) => {
                                    return (
                                        <TableRow key={organisation.id}>
                                            <TableCell>
                                                <div style={styles.label}>{organisation.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <a style={styles.linkButton} onClick={() => this.editOrganisation(organisation)}>edit</a>
                                                <a style={styles.linkButton} onClick={() => this.deleteOrganisationAsk(organisation)}>delete</a>
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
                        count={this.kba.organisation_list.length + 1}
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

export default Organisations;
