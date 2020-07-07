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

import {Home} from '../home';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Grid from "@material-ui/core/Grid";


const styles = {
    pageWidth: {
        width: '900px',
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
    disabledLinkButton: {
        float: 'left',
        padding: '10px',
        color: '#eee',
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
    },
    dlImageSize: {
        width: '24px',
    },
    dlImageSizeDisabled: {
        width: '24px',
        opacity: '0.2'
    },
    searchBox: {
        boxShadow: 'none',
    },
    floatLeftLabel: {
        float: 'left',
        marginRight: '6px',
        marginTop: '4px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    floatLeft: {
        float: 'left',
    },
    searchFloatLeft: {
        float: 'left',
    },
    findBox: {
        padding: '10px',
        marginBottom: '5px',
        float: 'right',
    },
    search: {
        marginTop: '2px',
        marginLeft: '15px',
        width: '18px',
        color: '#000',
    },
};

const roles = ['admin', 'operator', 'crawler', 'manager']; // reporter has been removed temporarily

export class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_user: false,
            user: null,
            edit_user_id: "",
            edit_first_name: "",
            edit_surname: "",
            edit_email: "",
            edit_password: "",
            edit_roles: [],
            edit_kb_list: [],
            // pagination
            page_size: 5,
            page: 0,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    numUsers(organisation_id, isAdmin) {
        let count = 0;
        for (const i in this.props.user_list) {
            const user = this.props.user_list[i];
            const roleStr = UserManager.formatRoles(this.props.selected_organisation_id, user.roles);
            if (isAdmin || roleStr.length > 0) { // has a role or isAdmin?
                count += 1;
            }
        }
        return count;
    }
    getUsers(isAdmin) {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        let index = 0;
        for (const i in this.props.user_list) {
            // paginate all users - but only those that have roles in this organisation
            const user = this.props.user_list[i];
            const roleStr = UserManager.formatRoles(this.props.selected_organisation_id, user.roles);
            if (isAdmin || roleStr.length > 0) { // has a role or is admin?
                if (index >= first && index < last) {
                    paginated_list.push(user);
                }
                index += 1; // one more user in this set of roles
            }
        }
        return paginated_list;
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    static formatRoles(organisationId, roles) {
        let roles_str = "";
        for (const role of roles) {
            // admin always displays
            if (role.organisationId === organisationId || role.role === "admin") {
                // make sure we add the admin role only once
                if (role.role === "admin" && roles_str.indexOf("admin") === -1) {
                    if (roles_str.length > 0) {
                        roles_str += ", ";
                    }
                    roles_str += role.role;
                } else if (role.role !== "admin") {  // any other role just add
                    if (roles_str.length > 0) {
                        roles_str += ", ";
                    }
                    roles_str += role.role;
                }
            }
        }
        return roles_str;
    }
    getAvailableRoles() {
        const list = [];
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        for (const available_role of roles) {
            let found = false;
            for (const role of this.state.edit_roles) {
                if (available_role === role) {
                    found = true;
                }
            }
            if (!found) {
                if (available_role === 'admin' && isAdmin) {
                    list.push(available_role);
                } else if (available_role !== 'admin') {
                    list.push(available_role);
                }
            }
        }
        return list;
    }
    addNewUser() {
        this.setState({edit_user: true, user: null,
                            edit_user_id: "", edit_first_name: "",
                            edit_surname: "", edit_email: "",
                            edit_password: "",
                            edit_roles: [],
                            edit_kb_list: [],
                        })
    }
    editUser(user) {
        if (user) {
            const filtered_roles = user.roles.filter(x => x.organisationId === this.props.selected_organisation_id);
            const role_list = [];
            for (const role of filtered_roles) {
                role_list.push(role.role);
            }
            const kb_list = [];
            if (user.operatorKBList) {
                for (const operatorKB of user.operatorKBList) {
                    for (const available_kb of this.props.knowledge_base_list) {
                        if (available_kb.kbId === operatorKB.kbId) {
                            kb_list.push(available_kb);
                        }
                    }
                }
            }
            this.setState({edit_user: true, user: user,
                edit_user_id: user.id,
                edit_first_name: user.firstName,
                edit_surname: user.surname,
                edit_email: user.email,
                edit_password: "",
                edit_roles: role_list,
                edit_kb_list: kb_list,
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
            if (this.state.edit_first_name.length === 0) {
                newFirst = capitalizeFirstLetter(firstNameSurname[0]);
            }
            if (this.state.edit_surname.length === 0 && firstNameSurname.length > 1) {
                newSur = capitalizeFirstLetter(firstNameSurname[1]);
            }
            if (newFirst.length > 0 && newSur.length > 0) {
                this.setState({edit_first_name: newFirst, edit_surname: newSur});

            } else if (newFirst.length > 0) {
                this.setState({edit_first_name: newFirst});

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
    deleteUserAsk(user, isAdmin) {
        if (user) {
            this.props.openDialog("are you sure you want to remove " + user.firstName + " " + user.surname + "?",
                "Remove User", (action) => {
                    this.deleteUser(action)
                });
            this.setState({user: user});
        }
    }
    deleteUser(action) {
        if (action) {
            this.props.deleteUser(this.props.selected_organisation_id, this.state.user.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_user: false, user: null});
        if (this.state.closeDialog) {
            this.state.closeDialog();
        }
    }
    editOk() {
        if (this.state.edit_first_name.length > 0 &&
            this.state.edit_surname.length > 0 &&
            this.state.edit_email.length > 0 &&
            (this.state.edit_user_id.length > 0 || this.state.edit_password.length > 0)) {

            // do we have an operator and knowledge bases?
            if (UserManager.hasOperatorRole(this.state.edit_roles) && this.state.edit_kb_list.length === 0) {
                this.props.setError("Incomplete Data", "An operator must have at least one knowledge base associated with it.");
            } else {
                // organisation_id, user_id, name, surname, email, password, role_list, kb_list
                this.props.updateUser(this.props.selected_organisation_id, this.state.edit_user_id,
                                      this.state.edit_first_name, this.state.edit_surname, this.state.edit_email,
                                      this.state.edit_password, this.state.edit_roles, this.state.edit_kb_list);
                this.setState({edit_user: false, user: null});
            }
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.  " +
                "Must have email-address, first-name, surname, and at least one role.  " +
                "New Accounts must have a password.");
        }
    }
    static hasOperatorRole(edit_roles) {
        if (edit_roles) {
            for (const role of edit_roles) {
                if (role === "operator") {
                    return true;
                }
            }
        }
        return false;
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getUsers();
        }
    }
    removeKBFromUser(kb) {
        const new_kbs = [];
        for (const ekb of this.state.edit_kb_list) {
            if (kb.kbId !== ekb.kbId) {
                new_kbs.push(ekb);
            }
        }
        this.setState({edit_kb_list: new_kbs});
    }
    addKBToUser(kb) {
        const kbs = JSON.parse(JSON.stringify(this.state.edit_kb_list));
        kbs.push(kb);
        this.setState({edit_kb_list: kbs});
    }
    getAvailableKnowledgeBases() {
        const list = [];
        for (const available_kb of this.props.knowledge_base_list) {
            let found = false;
            for (const kb of this.state.edit_kb_list) {
                if (available_kb.kbId === kb.kbId) {
                    found = true;
                }
            }
            if (!found) {
                list.push(available_kb);
            }
        }
        return list;
    }
    render() {
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        const isManager = Home.hasRole(this.props.user, ['manager']);
        return (
            <div>

                <div style={styles.searchBox}>
                    <Grid item xs={12}>
                        <div style={styles.findBox}>
                            <div style={styles.floatLeftLabel}>filter</div>
                            <div style={styles.searchFloatLeft}>
                                <input type="text" value={this.props.user_filter} autoFocus={true} style={styles.text}
                                       onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                       onChange={(event) => {
                                           this.props.setUserFilter(event.target.value)
                                       }}/>
                            </div>
                            <div style={styles.floatLeft}>
                                <img style={styles.search}
                                     onClick={() => this.props.getUsers()}
                                     src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                            </div>
                        </div>
                    </Grid>
                </div>

                <Paper style={styles.pageWidth}>
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
                                this.getUsers(isAdmin).map((user) => {
                                    const canEdit = Home.canEdit(user, isAdmin, isManager);
                                    const canDelete = Home.canDelete(user, this.props.user, isAdmin, isManager);
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div style={styles.label}>{user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{user.firstName}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{user.surname}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{UserManager.formatRoles(this.props.selected_organisation_id, user.roles)}</div>
                                            </TableCell>
                                            <TableCell>
                                                { !canEdit &&
                                                    <div style={styles.disabledLinkButton} title="cannot edit this user">
                                                        <img src="../images/edit.svg" style={styles.dlImageSizeDisabled}
                                                             title="cannot edit this user" alt="cannot edit this user"/>
                                                    </div>
                                                }
                                                { canEdit &&
                                                    <div style={styles.linkButton} title="Edit this user"
                                                         onClick={() => this.editUser(user)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize}
                                                             title="edit user" alt="edit"/>
                                                    </div>
                                                }
                                                {
                                                    !canDelete &&
                                                    <div style={styles.disabledLinkButton} title="cannot remove this user">
                                                        <img src="../images/delete.svg" style={styles.dlImageSizeDisabled}
                                                             title="cannot remove this user" alt="cannot remove this user"/>
                                                    </div>
                                                }
                                                {
                                                    canDelete &&
                                                    <div style={styles.linkButton} title="Remove this user"
                                                         onClick={() => this.deleteUserAsk(user, isAdmin)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize}
                                                             title={isAdmin ? "remove user" : "remove user roles"} alt="remove"/>
                                                    </div>
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
                                    {this.props.selected_organisation_id.length > 0 && (isAdmin || isManager) &&
                                    <a style={styles.imageButton} onClick={() => this.addNewUser()}><img
                                        style={styles.addImage} src="../images/add.svg" title="add new user"
                                        alt="add new user"/></a>
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={this.numUsers(this.props.selected_organisation_id, isAdmin)}
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
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </Paper>


                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.edit_user}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={() => this.setState({edit_user: false, user: null})} >
                    <DialogTitle>{this.state.edit_user_id ? "Edit User" : "Add New User"}</DialogTitle>
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
                            value={this.state.edit_first_name}
                            onChange = {(event) => this.setState({edit_first_name: event.target.value})}
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
                                </div>roles
                            </div>
                        </div>
                        { UserManager.hasOperatorRole(this.state.edit_roles) &&
                            <div>
                                <div style={styles.roleBlock}>
                                    <div style={styles.roleLabel}>operator's knowledge bases</div>
                                    <div style={styles.roleArea}>
                                        {
                                            this.state.edit_kb_list.map((kb) => {
                                                return (<Chip key={kb.kbId} color="secondary"
                                                              style={styles.roleChip}
                                                              onClick={() => this.removeKBFromUser(kb)}
                                                              label={kb.name} variant="outlined"/>)
                                            })
                                        }
                                    </div>
                                </div>
                                <div style={styles.roleBlock}>
                                    <div style={styles.roleLabel}>operator available knowledge bases</div>
                                    <div style={styles.roleArea}>
                                        {
                                            this.getAvailableKnowledgeBases().map((kb) => {
                                                return (<Chip key={kb.kbId} color="primary"
                                                              style={styles.roleChip}
                                                              onClick={() => this.addKBToUser(kb)}
                                                              label={kb.name} variant="outlined"/>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }
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

        user_list: state.appReducer.user_list,
        user_filter: state.appReducer.user_filter,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        user: state.appReducer.user,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(UserManager);

