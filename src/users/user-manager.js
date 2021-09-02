import React from 'react';

import {Home} from '../home';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import UserEdit from "./user-edit";
import Api from "../common/api";
import {Pagination} from "../common/pagination";

import '../css/users.css';


export class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            // edit dialog
            edit_user: false,
            user: null,
            edit_user_id: "",
            edit_first_name: "",
            edit_surname: "",
            edit_email: "",
            edit_password: "",
            edit_roles: [],
            edit_kb_list: [],
            edit_groups: [],

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
                    roles_str += Api.getPrettyRole(role.role);
                } else if (role.role !== "admin") {  // any other role just add
                    if (roles_str.length > 0) {
                        roles_str += ", ";
                    }
                    roles_str += Api.getPrettyRole(role.role);
                }
            }
        }
        return roles_str;
    }
    addNewUser() {
        this.setState({edit_user: true, user: null,
                            edit_user_id: "", edit_first_name: "",
                            edit_surname: "", edit_email: "",
                            edit_password: "",
                            edit_roles: [],
                            edit_kb_list: [],
                            edit_groups: [],
                        })
    }
    editUser(user) {
        if (user) {
            // only allow roles that apply to this organisation that this user has
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
                edit_groups: user.groupList,
            })
        }
    }
    deleteUserAsk(user, isAdmin) {
        if (user && this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0) {
            this.props.openDialog("are you sure you want to remove " + user.firstName + " " + user.surname + "?",
                "Remove User", (action) => {
                    this.deleteUser(action)
                });
            this.setState({user: user});
        } else {
            this.props.setError('No Organisation', 'Please select an organisation from the drop-down box.')
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
    static hasAdministratorRole(edit_roles) {
        if (edit_roles) {
            for (const role of edit_roles) {
                if (role === "admin") {
                    return true;
                }
            }
        }
        return false;
    }
    editDone(save, data) {
        if (!save) {
            this.setState({edit_user: false, user: null,
                edit_user_id: "", edit_first_name: "", edit_surname: "", edit_email: "",
                edit_password: "", edit_roles: [], edit_kb_list: [], edit_groups: [],
            });
            if (this.state.closeDialog) {
                this.state.closeDialog();
            }
        } else {
            if (data.first_name.length > 0 &&
                data.surname.length > 0 &&
                data.email.length > 0 &&
                (data.user_id.length > 0 || data.password.length > 0)) {

                // do we have an operator and knowledge bases?
                if (UserManager.hasOperatorRole(data.roles) && data.kb_list.length === 0) {
                    this.props.setError("Incomplete Data", "An operator must have at least one knowledge base associated with it.");

                } else {

                    // put up an alert warning?
                    if (!UserManager.hasAdministratorRole(this.state.edit_roles) && UserManager.hasAdministratorRole(data.roles)) {
                        // if this user wasn't an administrator, but is now, show a warning
                        alert("WARNING:\n\nYou are about to assign administrative rights to this user.\nPlease be responsible and consider assigning the right permissions to the right people.");
                    }

                    // organisation_id, user_id, name, surname, email, password, role_list, kb_list
                    this.props.updateUser(this.props.selected_organisation_id, data.user_id,
                        data.first_name, data.surname, data.email, data.password, data.roles, data.kb_list, data.groups);

                    this.setState({
                        edit_user: false, user: null,
                        edit_user_id: "", edit_first_name: "", edit_surname: "", edit_email: "",
                        edit_password: "", edit_roles: [], edit_kb_list: [], edit_groups: [],
                    });

                }
            } else {
                this.props.setError("Incomplete Data", "Please complete all fields.  " +
                    "Must have email-address, first-name, surname, and at least one role.  " +
                    "New Accounts must have a password.");
            }
        }
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter" && this.props.selected_organisation_id) {
            this.props.getUsers(this.props.selected_organisation_id);
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0;
    }
    render() {
        const theme = this.props.theme;
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        const isManager = Home.hasRole(this.props.user, ['manager']);
        return (
            <div className="user-display">
                { this.isVisible() &&
                <div>

                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.user_filter} autoFocus={true} className={theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setUserFilter(event.target.value)
                                   }}/>
                       </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getUsers()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </span>
                    </div>

                    <br clear="both" />

                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>user name</th>
                                    <th className='table-header'>first name</th>
                                    <th className='table-header'>surname</th>
                                    <th className='table-header'>roles</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getUsers(isAdmin).map((user) => {
                                        const canEdit = Home.canEdit(user, isAdmin, isManager);
                                        const canDelete = Home.canDelete(user, this.props.user, isAdmin, isManager);
                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="label">{user.email}</div>
                                                </td>
                                                <td>
                                                    <div className="label">{user.firstName}</div>
                                                </td>
                                                <td>
                                                    <div className="label">{user.surname}</div>
                                                </td>
                                                <td>
                                                    <div className="role-label">{UserManager.formatRoles(this.props.selected_organisation_id, user.roles)}</div>
                                                </td>
                                                <td>
                                                    { !canEdit &&
                                                        <div className="disabled-link-button" title="cannot edit this user">
                                                            <img src="../images/edit.svg" className="dl-image-size-disabled"
                                                                 title="cannot edit this user" alt="cannot edit this user"/>
                                                        </div>
                                                    }
                                                    { canEdit &&
                                                        <div className="link-button" title="Edit this user"
                                                             onClick={() => this.editUser(user)}>
                                                            <img src="../images/edit.svg" className="dl-image-size"
                                                                 title="edit user" alt="edit"/>
                                                        </div>
                                                    }
                                                    {
                                                        !canDelete &&
                                                        <div className="disabled-link-button" title="cannot remove this user">
                                                            <img src="../images/delete.svg" className="dl-image-size-disabled"
                                                                 title="cannot remove this user" alt="cannot remove this user"/>
                                                        </div>
                                                    }
                                                    {
                                                        canDelete &&
                                                        <div className="link-button" title="Remove this user"
                                                             onClick={() => this.deleteUserAsk(user, isAdmin)}>
                                                            <img src="../images/delete.svg" className="dl-image-size"
                                                                 title={isAdmin ? "remove user" : "remove user roles"} alt="remove"/>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                    <td>
                                        {this.props.selected_organisation_id.length > 0 && (isAdmin || isManager) &&
                                        <div className="image-button" onClick={() => this.addNewUser()}>
                                            <img className="add-image" src="../images/add.svg" title="add new user" alt="add new user"/>
                                        </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={5}>
                                        <Pagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={this.numUsers(this.props.selected_organisation_id, isAdmin)}
                                            rowsPerPage={this.state.page_size}
                                            page={this.state.page}
                                            onChangePage={(page) => this.changePage(page)}
                                            onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                    <UserEdit open={this.state.edit_user}
                              theme={theme}
                              organisation_id={this.props.selected_organisation_id}
                              user={this.props.user}
                              edit_user_id={this.state.edit_user_id}
                              edit_email={this.state.edit_email}
                              edit_first_name={this.state.edit_first_name}
                              edit_surname={this.state.edit_surname}
                              edit_password={this.state.edit_password}
                              edit_roles={this.state.edit_roles}
                              edit_kb_list={this.state.edit_kb_list}
                              edit_groups={this.state.edit_groups}
                              all_groups={this.props.group_list}
                              all_users={this.props.user_list}
                              knowledge_base_list={this.props.knowledge_base_list}
                              setError={this.props.setError}
                              onClose={(save, data) => this.editDone(save, data)}
                              onError={(title, msg) => this.props.setError(title, msg)}
                    />

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

        user_list: state.appReducer.user_list,
        user_filter: state.appReducer.user_filter,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        group_list: state.appReducer.group_list,
        user: state.appReducer.user,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(UserManager);

