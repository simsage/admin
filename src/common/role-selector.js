import {Chip} from "./chip";
import React, {Component} from "react";
import  '../css/role-selector.css'

// selector for SimSage roles
export class RoleSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            role_list: props.role_list ? props.role_list: [],
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            role_list: props.role_list ? props.role_list: [],
        })
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    update_parent(role_list) {
        if (this.props.onChange) {
            this.props.onChange(role_list);
        }
    }
    removeRole(role) {
        const new_role_list = [];
        for (const e_role of this.state.role_list) {
            if (e_role !== role) {
                new_role_list.push(e_role);
            }
        }
        this.setState({role_list: new_role_list});
        this.update_parent(new_role_list);
    }
    addRole(role) {
        const role_list = JSON.parse(JSON.stringify(this.state.role_list));
        role_list.push(role);
        this.setState({role_list: role_list});
        this.update_parent(role_list);
    }
    getAllRoles() {
        return this.props.allowed_roles ? this.props.allowed_roles :
                ['admin', 'search', 'manager', 'dms', 'discover'];
    }
    getAvailableRoles() {
        const list = [];
        for (const role of this.getAllRoles()) {
            if (!this.state.role_list.includes(role)) {
                list.push(role);
            }
        }
        return list;
    }
    getSelectedRoles() {
        return this.state.role_list;
    }
    selectAll() {
        const new_roles = this.getAllRoles();
        this.setState({userIdList: new_roles});
        this.update_parent(new_roles);
    }
    clearAll() {
        this.setState({role_list: []});
        this.update_parent([]);
    }
    render() {
        if (this.state.has_error) {
            return <h1>role-selector.js: Something went wrong.</h1>;
        }
        return (
            <div className="role-control">
                <div className="clear-float">
                    <div className="role-block">
                        <div className="role-label">selected</div>
                        <div className="role-area">
                            {
                                this.getSelectedRoles().map((role, i) => {
                                    return (<Chip key={i} color="secondary"
                                                  onClick={() => this.removeRole(role)}
                                                  label={role} variant="outlined"/>)
                                })
                            }
                        </div>
                    </div>
                    <div className="role-block">
                        <div className="role-label">available</div>
                        <div className="role-area">
                            {
                                this.getAvailableRoles().map((role, i) => {
                                    return (<Chip key={i} color="primary"
                                                  onClick={() => this.addRole(role)}
                                                  label={role} variant="outlined"/>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoleSelector;
