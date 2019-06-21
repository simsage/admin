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
import Chip from '@material-ui/core/Chip';
import TablePagination from '@material-ui/core/TablePagination';

import {Api} from '../common/api'
import {Comms} from '../common/comms'
import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'


const styles = {
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
    }
};

const roles = ['admin', 'operator', 'crawler', 'manager', 'reporter'];

export class Users extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            user_list: [],

            edit_user: false,
            user: null,

            edit_user_id: "",
            edit_firstname: "",
            edit_surname: "",
            edit_email: "",
            edit_password: "",
            edit_roles: [],

            error_msg: "",
            error_title: "",

            message_title: "",
            message: "",

            // pagination
            page_size: 5,
            nav_list: ['null'],
            page: 0,
            prev_page: 'null',
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentWillReceiveProps(props) {
        this.kba = props.kba;
        this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, this.state.page_size);
    }
    componentDidMount() {
        this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, this.state.page_size);
    }
    refreshUsers(org_id, prev_page, page_size) {
        if (org_id && org_id.length > 0) {
            Api.getUsersPaginated(org_id, prev_page, page_size,
                (userList) => {
                    this.setState({user_list: userList})
                },
                (errStr) => {
                    this.showError("Error", errStr)
                }
            )
        }
    }
    changePage(page) {
        const page0 = this.state.page;
        const user_list = this.state.user_list;
        const nav_list = this.state.nav_list;
        if (page0 !== page && page >= 0) {
            if (page0 < page) {
                // next page
                if (user_list.length > 0) {
                    const prev = user_list[user_list.length - 1].email;
                    nav_list.push(prev);
                    this.setState({nav_list: nav_list, page: page});
                    this.refreshUsers(this.kba.selected_organisation_id, prev, this.state.page_size);
                }
            } else {
                // prev page
                const prev = nav_list[page];
                this.setState({page: page});
                this.refreshUsers(this.kba.selected_organisation_id, prev, this.state.page_size);
            }
        }
    }
    changePageSize(page_size) {
        console.log(page_size);
        this.setState({page_size: page_size});
        this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, page_size);
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    formatRoles(organisationId, roles) {
        let roles_str = "";
        for (const role of roles) {
            if (role.organisationId === organisationId) {
                if (roles_str.length > 0) {
                    roles_str += ", ";
                }
                roles_str += role.role;
            }
        }
        return roles_str;
    }
    getAvailableRoles() {
        const list = [];
        for (const avaible_role of roles) {
            let found = false;
            for (const role of this.state.edit_roles) {
                if (avaible_role === role) {
                    found = true;
                }
            }
            if (!found) {
                list.push(avaible_role);
            }
        }
        return list;
    }
    addNewUser() {
        this.setState({edit_user: true, knowledgeBase: null,
            edit_kb_id: "",
            edit_firstname: "",
            edit_surname: "",
            edit_email: "",
            edit_password: "",
            edit_roles: [],
        })
    }
    editUser(user) {
        if (user) {
            const filtered_roles = user.roles.filter(x => x.organisationId === this.kba.selected_organisation_id);
            const role_list = [];
            for (const role of filtered_roles) {
                role_list.push(role.role);
            }
            this.setState({edit_user: true, knowledgeBase: user,
                edit_kb_id: user.id,
                edit_firstname: user.firstName,
                edit_surname: user.surname,
                edit_email: user.email,
                edit_password: "",
                edit_roles: role_list,
            })
        }
    }
    fillNames() {
        function capitalizeFirstLetter(string) {
            if (string.length > 0) {
                return string.slice(0, 1).toUpperCase() + string.slice(1);
            }
            return string;
        }        // if there is an email address and there is no first-surname - try and use the email address to complete
        if (this.state.edit_email.length > 0 && this.state.edit_email.indexOf('@') > 0) {
            const firstPart = this.state.edit_email.split('@')[0];
            const firstNameSurname = firstPart.split('.');
            let newFirst = "";
            let newSur = "";
            if (this.state.edit_firstname.length === 0) {
                newFirst = capitalizeFirstLetter(firstNameSurname[0]);
            }
            if (this.state.edit_surname.length === 0 && firstNameSurname.length > 1) {
                newSur = capitalizeFirstLetter(firstNameSurname[1]);
            }
            if (newFirst.length > 0 && newSur.length > 0) {
                this.setState({edit_firstname: newFirst, edit_surname: newSur});

            } else if (newFirst.length > 0) {
                this.setState({edit_firstname: newFirst});

            } else if (newSur.length > 0) {
                this.setState({edit_surname: newSur});
            }
        }
    }
    removeRoleFromUser(role) {
        const new_roles = [];
        for (const erole of this.state.edit_roles) {
            if (role !== erole) {
                new_roles.push(erole);
            }
        }
        this.setState({edit_roles: new_roles});
    }
    addRoleToUser(role) {
        const roles = JSON.parse(JSON.stringify(this.state.edit_roles));
        roles.push(role);
        this.setState({edit_roles: roles});
    }
    deleteUserAsk(user) {
        if (user) {
            this.setState({message_title: "Remove User from Organisation",
                message: "are you sure you want to remove " + user.firstName + " " + user.surname + " from this organisation?",
                knowledgeBase: user})
        }
    }
    deleteUser(action) {
        if (action) {
            Api.removeUserFromOrganisation(Comms.getSession().userId, this.kba.selected_organisation_id, () => {
                this.setState({message_title: "", message: ""});
                this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, this.state.page_size);
            }, (errStr) => {
                this.setState({message_title: "", message: "",
                                     error_msg: errStr, error_title: "Error Removing User"});
            })
        } else {
            this.setState({message_title: "", message: ""});
        }
    }
    editCancel() {
        this.setState({edit_user: false, knowledgeBase: null})
    }
    editOk() {
        if (this.state.edit_firstname.length > 0 &&
            this.state.edit_surname.length > 0 &&
            this.state.edit_email.length > 0 &&
            (this.state.edit_kb_id.length > 0 || this.state.edit_password.length > 0) &&
            this.state.edit_roles.length > 0) {

            Api.updateUser(this.kba.selected_organisation_id, this.state.edit_kb_id,
                           this.state.edit_firstname, this.state.edit_surname, this.state.edit_email,
                           this.state.edit_password, this.state.edit_roles,
                (user) => {
                    this.setState({edit_user: false, knowledgeBase: null});
                    this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, this.state.page_size);
                },
                (errStr) => {
                    this.setState({edit_user: false, error_msg: errStr, error_title: "Error Updating User"});
                });
        } else {
            this.setState({
                error_msg: "Please complete all fields.  " +
                    "Must have email-address, first-name, surname, and at least one role.  " +
                    "New Accounts must have a password.",
                error_title: "Incomplete Data"});
        }
    }
    makePrime(user) {
        Api.setUserPrimaryOrganisation(user.id, this.kba.selected_organisation_id,
            (user) => {
                this.refreshUsers(this.kba.selected_organisation_id, this.state.prev_page, this.state.page_size);
            },
            (errStr) => {
                this.setState({edit_user: false, error_msg: errStr, error_title: "Error Making User Primary"});
            });
    }
    render() {
        if (this.state.has_error) {
            return <h1>users.js: Something went wrong.</h1>;
        }
        return (
            <div>
                <ErrorDialog
                    callback={() => { this.closeError() }}
                    open={this.state.error_msg.length > 0}
                    message={this.state.error_msg}
                    title={this.state.error_title} />

                <MessageDialog callback={(action) => { this.deleteUser(action) }}
                    open={this.state.message.length > 0}
                    message={this.state.message}
                    title={this.state.message_title} />

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow style={styles.tableHeaderStyle}>
                                <TableCell style={styles.tableHeaderStyle}>user name</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>first name</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>surname</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>roles</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.user_list.map((user) => {
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div style={styles.label}>{user.primaryOrganisationId === this.kba.selected_organisation_id ? '• ' : " "}{user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{user.firstName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{user.surname}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{this.formatRoles(this.kba.selected_organisation_id, user.roles)}</div>
                                            </TableCell>
                                            <TableCell>
                                                <a style={styles.linkButton} title="Edit this user" onClick={() => this.editUser(user)}>edit</a>
                                                <a style={styles.linkButton} title="Remove this user" onClick={() => this.deleteUserAsk(user)}>delete</a>
                                                {user.primaryOrganisationId !== this.kba.selected_organisation_id &&
                                                    <a style={styles.linkButton} title="Make this organisation this user's primary organisation"
                                                       onClick={() => this.makePrime(user)}>prime</a>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell>
                                    {this.kba.selected_organisation_id.length > 0 &&
                                    <a style={styles.imageButton} onClick={() => this.addNewUser()}><img
                                        style={styles.addImage} src="../images/add.svg" title="add new user"
                                        alt="add new user"/></a>
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.user_list.length + 1}
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
                        open={this.state.edit_user}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={() => this.setState({edit_user: false, knowledgeBase: null})} >
                    <DialogTitle>{this.state.edit_kb_id ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={true}
                            style={styles.editBox}
                            placeholder="email"
                            label="email"
                            value={this.state.edit_email}
                            onBlur={() => this.fillNames()}
                            onChange = {(event) => this.setState({edit_email: event.target.value})}
                        />
                        <TextField
                            style={styles.editBox}
                            placeholder="first name"
                            label="first name"
                            value={this.state.edit_firstname}
                            onChange = {(event) => this.setState({edit_firstname: event.target.value})}
                        />
                        <TextField
                            style={styles.editBox}
                            placeholder="surname"
                            label="surname"
                            value={this.state.edit_surname}
                            onChange = {(event) => this.setState({edit_surname: event.target.value})}
                        />
                        <TextField
                            style={styles.editBox}
                            placeholder="password"
                            label="password"
                            type="password"
                            value={this.state.edit_password}
                            onChange = {(event) => this.setState({edit_password: event.target.value})}
                        />
                        <div>
                            <div style={styles.roleBlock}>
                                <div style={styles.roleLabel}>user roles</div>
                                <div style={styles.roleArea}>
                                {
                                    this.state.edit_roles.map((role) => {
                                        return (<Chip key={role} color="secondary"
                                                      style={styles.roleChip}
                                                      onClick={() => this.removeRoleFromUser(role)}
                                                      label={role} variant="outlined" />)
                                    })
                                }
                                </div>
                            </div>
                            <div style={styles.roleBlock}>
                                <div style={styles.roleLabel}>available roles</div>
                                <div style={styles.roleArea}>
                                    {
                                        this.getAvailableRoles().map((role) => {
                                            return (<Chip key={role} color="primary"
                                                          style={styles.roleChip}
                                                          onClick={() => this.addRoleToUser(role)}
                                                          label={role} variant="outlined" />)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
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

export default Users;
