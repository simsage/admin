import React from 'react';

import {Chip} from "../common/chip";
import {Home} from '../home';
import GroupSelector from "../common/group-selector";
import Api from "../common/api";

import '../css/users.css';


const roles = ['admin', 'operator', 'dms', 'manager', 'discover', 'search'];

// props:  theme, open, edit_user_id, edit_email, edit_first_name, edit_surname, edit_password, edit_roles, edit_groups, edit_kb_list
// fns: onClose(save:boolean)
export class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'details',
            edit_password_2: '',
            edit_user_id: this.props.edit_user_id ? this.props.edit_user_id : '',
            edit_email: this.props.edit_email ? this.props.edit_email : '',
            edit_first_name: this.props.edit_first_name ? this.props.edit_first_name : '',
            edit_surname: this.props.edit_surname ? this.props.edit_surname : '',
            edit_password: this.props.edit_password ? this.props.edit_password : '',
            edit_roles: this.props.edit_roles ? this.props.edit_roles : [],
            edit_kb_list: this.props.edit_kb_list ? this.props.edit_kb_list : [],
            edit_groups: this.props.edit_groups ? this.props.edit_groups : [],
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            selectedTab: 'details',
            edit_user_id: nextProps.edit_user_id ? nextProps.edit_user_id : '',
            edit_email: nextProps.edit_email ? nextProps.edit_email : '',
            edit_first_name: nextProps.edit_first_name ? nextProps.edit_first_name : '',
            edit_surname: nextProps.edit_surname ? nextProps.edit_surname : '',
            edit_password: nextProps.edit_password ? nextProps.edit_password : '',
            edit_roles: nextProps.edit_roles.length > 0 ? nextProps.edit_roles : [],
            edit_kb_list: nextProps.edit_kb_list.length > 0 ? nextProps.edit_kb_list : [],
            edit_groups: nextProps.edit_groups.length > 0 ? nextProps.edit_groups : [],
        });
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
    }
    getData() {
        return {
            user_id: this.state.edit_user_id,
            email: this.state.edit_email,
            first_name: this.state.edit_first_name,
            surname: this.state.edit_surname,
            password: this.state.edit_password,
            roles: this.state.edit_roles,
            kb_list: this.state.edit_kb_list,
            groups: this.state.edit_groups,
        };
    }
    close(save) {
        let do_save = true;
        if (save) {
            if (this.props.onUpdate)
                this.props.onUpdate(this.getData());
            if (this.state.edit_password_2 !== this.state.edit_password) {
                do_save = false;
                if (this.props.onError) {
                    this.props.onError("Error", "passwords do not match");
                }
            }
        }
        if (do_save) {
            if (this.props.onClose) {
                if (save) {
                    this.props.onClose(save, this.getData(), () => {
                        this.setState({edit_password_2: ''});
                    });
                } else {
                    this.setState({edit_password_2: ''});
                    this.props.onClose(save, {});
                }
            }
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
        for (const e_role of this.state.edit_roles) {
            if (role !== e_role) {
                new_roles.push(e_role);
            }
        }
        this.setState({edit_roles: new_roles});
    }
    addRoleToUser(role) {
        const roles = JSON.parse(JSON.stringify(this.state.edit_roles));
        let found = false;
        for (const e_role of this.state.edit_roles) {
            if (role === e_role) {
                found = true;
            }
        }
        if (!found) {
            roles.push(role);
            this.setState({edit_roles: roles});
        }
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
        if (!this.props.open)
            return (<div />);
        return (
            <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                        <div className="modal-header">{this.props.edit_user_id ? "Edit User" : "Add New User"}</div>
                        <div className="modal-body">

                            <ul className="nav nav-tabs">
                                <li className="nav-item nav-cursor">
                                    <div className={"nav-link " + (this.state.selectedTab === 'details' ? 'active' : '')}
                                         onClick={() => this.setState({selectedTab: 'details'})}>user details</div>
                                </li>
                                <li className="nav-item nav-cursor">
                                    <div className={"nav-link " + (this.state.selectedTab === 'roles' ? 'active' : '')}
                                         onClick={() => this.setState({selectedTab: 'roles'})}>roles</div>
                                </li>
                                <li className="nav-item nav-cursor">
                                    <div className={"nav-link " + (this.state.selectedTab === 'groups' ? 'active' : '')}
                                         onClick={() => this.setState({selectedTab: 'groups'})}>groups</div>
                                </li>
                            </ul>

                            {
                                this.state.selectedTab === 'details' &&
                                <div className="tab-content">

                                    <div className="control-row">
                                        <span className="label-2">email</span>
                                        <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                    autoFocus={true}
                                                    autoComplete="false"
                                                    placeholder="email"
                                                    value={this.state.edit_email}
                                                    onBlur={() => this.fillNames()}
                                                    onChange={(event) => this.setState({edit_email: event.target.value})}
                                                />
                                                </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">first name</span>
                                        <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="first name"
                                                       value={this.state.edit_first_name}
                                                       onChange={(event) => this.setState({edit_first_name: event.target.value})}
                                            />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">surname</span>
                                        <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="surname"
                                                       value={this.state.edit_surname}
                                                       onChange={(event) => this.setState({edit_surname: event.target.value})}
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">password</span>
                                        <span className="text">
                                            <form>
                                                <input type="password" className="form-control"
                                                       autoComplete="false"
                                                       placeholder={this.props.edit_user_id ? "leave blank not to change" : "password"}
                                                       value={this.state.edit_password}
                                                       onChange={(event) => this.setState({edit_password: event.target.value})}
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">verify password</span>
                                        <span className="text">
                                            <form>
                                                <input type="password" className="form-control"
                                                       autoComplete="false"
                                                       placeholder={this.props.edit_user_id ? "leave blank not to change" : "verify password"}
                                                       value={this.state.edit_password_2}
                                                       onChange={(event) => this.setState({edit_password_2: event.target.value})}
                                                />
                                            </form>
                                        </span>
                                    </div>

                                </div>
                            }

                            {
                                this.state.selectedTab === 'roles' &&
                                <div className="tab-content">
                                    <div>
                                        <div className="role-block">
                                            <div className="role-label">SimSage roles</div>
                                            <div className="role-area">
                                                {
                                                    this.state.edit_roles.map((role, i) => {
                                                        return (<Chip key={i} color="secondary"
                                                                      onClick={() => this.removeRoleFromUser(role)}
                                                                      label={Api.getPrettyRole(role)} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="role-block">
                                            <div className="role-label">available SimSage roles</div>
                                            <div className="role-area">
                                                {
                                                    this.getAvailableRoles().map((role, i) => {
                                                        return (<Chip key={i} color="primary"
                                                                      onClick={() => this.addRoleToUser(role)}
                                                                      label={Api.getPrettyRole(role)} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <br style={{clear: 'both'}} />

                                    {UserEdit.hasOperatorRole(this.state.edit_roles) &&
                                    <div>
                                        <div className="role-block">
                                            <div className="role-label">operator's knowledge bases</div>
                                            <div className="role-area">
                                                {
                                                    this.state.edit_kb_list.map((kb, i) => {
                                                        return (<Chip key={i} color="secondary"
                                                                      onClick={() => this.removeKBFromUser(kb)}
                                                                      label={kb.name} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="role-block">
                                            <div className="role-label">operator available knowledge bases</div>
                                            <div className="role-area">
                                                {
                                                    this.getAvailableKnowledgeBases().map((kb, i) => {
                                                        return (<Chip key={i} color="primary"
                                                                      onClick={() => this.addKBToUser(kb)}
                                                                      label={kb.name} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>
                            }


                            {
                                this.state.selectedTab === 'groups' &&
                                <div className="tab-content">

                                    <GroupSelector
                                        group_list={this.props.all_groups}
                                        include_users={false}
                                        organisation_id={this.props.organisation_id}
                                        user_list={this.props.all_users}
                                        selected_group_list={this.state.edit_groups}
                                        onChange={(groups) => this.setState({edit_groups: groups})}
                                    />

                                </div>
                            }

                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.close(false)}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.close(true)}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default UserEdit;

