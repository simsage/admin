import React, {Component} from 'react';

import '../css/organisations.css'
import GroupSelector from "../common/group-selector";
import RoleSelector from "../common/role-selector";

export class OrganisationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,

            selectedTab: 'general',

            id: this.props.id,
            name: this.props.name,
            enabled: this.props.enabled,

            autoCreateSSOUsers: this.props.autoCreateSSOUsers,
            autoCreateSSODomainList: [],
            autoCreateSSOACLList: [],
            autoCreateSSORoleList: [],
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({
                id: this.state.id,
                name: this.state.name,
                enabled: this.state.enabled,

                autoCreateSSOUsers: this.state.autoCreateSSOUsers,
                autoCreateSSODomainList: this.csvToList(this.state.autoCreateSSODomainList),
                autoCreateSSOACLList: this.getGroupNames(this.state.autoCreateSSOACLList),
                autoCreateSSORoleList: this.state.autoCreateSSORoleList,
            });
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,

            id: props.id,
            name: props.name,
            enabled: props.enabled,

            autoCreateSSOUsers: props.autoCreateSSOUsers,
            autoCreateSSODomainList: this.listToCsv(props.autoCreateSSODomainList),
            autoCreateSSOACLList: this.groupsFromNames(props.autoCreateSSOACLList),
            autoCreateSSORoleList: props.autoCreateSSORoleList,
        })
    }
    groupsFromNames(group_name_list) {
        const group_list = [];
        console.log("group_name_list", group_name_list);
        for (const group of this.props.all_groups) {
            if (group_name_list.includes(group.name)) {
                console.log("group", group, group_name_list);
                group_list.push(group);
            }
        }
        return group_list;
    }
    csvToList(csv) {
        const list = [];
        for (const item of csv.split(",")) {
            if (item && item.trim && item.trim().length > 0) {
                list.push(item.trim());
            }
        }
        return list;
    }
    listToCsv(list) {
        return list.join(",")
    }
    getGroupNames(groups) {
        const group_list = [];
        for (const group of groups) {
            group_list.push(group.name);
        }
        return group_list;
    }
    render() {
        if (this.state.has_error) {
            return <h1>organisation-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        const t_value = this.state.selectedTab;
        const organisation_id = '';
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit Organisation</div>
                        <div className="modal-body">

                            <ul className="nav nav-tabs">
                                <li className="nav-item nav-cursor">
                                    <div className={"nav-link " + (this.state.selectedTab === 'general' ? 'active' : '')}
                                         onClick={() => this.setState({selectedTab: 'general'})}>general</div>
                                </li>
                                <li className="nav-item nav-cursor">
                                    <div className={"nav-link " + (this.state.selectedTab === 'sso' ? 'active' : '')}
                                         onClick={() => this.setState({selectedTab: 'sso'})}>Single Sign On</div>
                                </li>
                            </ul>

                            {t_value === 'general' &&
                                <div className="display-blocking form-width">
                                    <br />
                                    <div className="control-row">
                                        <span className="label-2">name</span>
                                        <span className="text">
                                            <input type="text" className="form-control"
                                                   autoFocus={true}
                                                   onChange={(event) => this.setState({name: event.target.value})}
                                                   placeholder="name"
                                                   value={this.state.name}
                                            />
                                        </span>
                                    </div>

                                    <br />
                                    <div className="control-row">
                                        <span className="checkbox-only">
                                            <input type="checkbox"
                                                   checked={this.state.enabled}
                                                   onChange={(event) => {
                                                       this.setState({enabled: event.target.checked});
                                                   }}
                                                   value="enable this organisation?"
                                            />
                                        </span>
                                        <span>organisation enabled?</span>
                                    </div>
                                </div>
                            }

                            {t_value === 'sso' &&
                                <div className="display-blocking form-width">
                                    <br />
                                    <div className="label-text">
                                        allow SSO (single sign-on) users to be auto-created with a default set of group ACLs and SimSage role(s).
                                    </div>
                                    <br />
                                    <div className="control-row">
                                        <span className="checkbox-only">
                                            <input type="checkbox"
                                                   checked={this.state.autoCreateSSOUsers}
                                                   onChange={(event) => {
                                                       this.setState({autoCreateSSOUsers: event.target.checked});
                                                   }}
                                                   value="enable SSO auto-user creation?"
                                            />
                                        </span>
                                        <span>enable SSO auto-user creation?</span>
                                    </div>

                                    <br />
                                    <div className="control-row">
                                        <div><b>domain csv</b></div>
                                        <textarea className="input-area"
                                                  onChange={(event) => this.setState({autoCreateSSODomainList: event.target.value})}
                                                  placeholder="valid domain names separated by commas"
                                                  rows={2}
                                                  value={this.state.autoCreateSSODomainList}
                                        />
                                    </div>


                                    <br />
                                    <div className="control-row div-width">
                                        <div><b>default ACLs</b></div>
                                        <div>
                                        <GroupSelector
                                            group_list={this.props.all_groups}
                                            include_users={false}
                                            organisation_id={organisation_id}
                                            user_list={[]}
                                            selected_group_list={this.state.autoCreateSSOACLList}
                                            onChange={(groups) => this.setState({autoCreateSSOACLList: groups})}
                                        />
                                        </div>
                                    </div>

                                    <br />
                                    <div className="control-row div-width">
                                        <div><b>default SimSage Roles</b></div>
                                        <RoleSelector
                                            role_list={this.state.autoCreateSSORoleList}
                                            allowed_roles={['search', 'dms', 'discover']}
                                            onChange={(roles) => this.setState({autoCreateSSORoleList: roles})}
                                            />
                                    </div>


                                </div>
                            }

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default OrganisationEdit;
