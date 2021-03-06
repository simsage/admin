import React, {Component} from 'react';

import '../css/acl-setup.css';


// create acls from groups
export class AclSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            acl_list: props.acl_list ? props.acl_list: [],
            selectedFilter: '',
            availableFilter: '',
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            acl_list: props.acl_list ? props.acl_list: [],
        })
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    update_parent(acl_list) {
        if (this.props.onChange) {
            this.props.onChange(acl_list);
        }
    }
    removeAcl(acl) {
        const new_acls = [];
        for (const s_acl of this.state.acl_list) {
            if (s_acl.acl !== acl.acl) {
                new_acls.push(s_acl);
            }
        }
        this.setState({acl_list: new_acls});
        this.update_parent(new_acls);
    }
    addAcl(group) {
        const acl_list = JSON.parse(JSON.stringify(this.state.acl_list));
        const acl = {"acl": group.name, "access": "R", isUser: group.isUser};
        let exists = false;
        for (const s_acl of this.state.acl_list) {
            if (s_acl.acl === group.name) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            acl_list.push(acl);
            this.setState({acl_list: acl_list});
            this.update_parent(acl_list);
        }
    }
    getAllGroups() {
        return this.props.group_list ? this.props.group_list : [];
    }
    getAllUsers() {
        return this.props.user_list ? this.props.user_list : [];
    }
    getAvailableGroupsOrUsers() {
        const list = [];
        const filter = this.state.availableFilter.trim().toLowerCase();
        for (const group of this.getAllGroups()) {
            let found = false;
            for (const s_acl of this.state.acl_list) {
                if (group.name === s_acl.acl) {
                    found = true;
                }
            }
            if (!found) { // still available (ie. not found)?
                if (filter.length === 0 || group.name.toLowerCase().indexOf(filter) >= 0) {
                    group.isUser = false;
                    list.push(group);
                }
            }
        }
        for (const user of this.getAllUsers()) {
            let found = false;
            for (const s_acl of this.state.acl_list) {
                if (user.email === s_acl.acl) {
                    found = true;
                }
            }
            if (!found) { // still available (ie. not found)?
                const user_name = user.email;
                if (filter.length === 0 || user_name.toLowerCase().indexOf(filter) >= 0) {
                    list.push({
                        organisationId: this.props.organisation_id,
                        name: user_name,
                        isUser: true,
                        userIdList: []
                    });
                }
            }
        }
        return list;
    }
    getAcls() {
        const acl_list = this.state.acl_list;
        const selected_acl_list = [];
        const filter = this.state.selectedFilter.trim().toLowerCase();
        const seen_set = {};
        for (const acl of acl_list) {
            if (acl && acl.acl) {
                if (filter.length === 0 || acl.acl.toLowerCase().indexOf(filter) >= 0) {
                    if (!seen_set.hasOwnProperty(acl.acl)) {
                        seen_set[acl.acl] = true;
                        selected_acl_list.push(acl);
                    }
                }
            }
        }
        return selected_acl_list;
    }
    invertAccess(event, acl, attribute) {
        event.preventDefault();
        event.stopPropagation();
        if (acl && acl.access && acl.access.indexOf(attribute) >= 0) {
            acl.access = acl.access.replace(attribute, "");
        } else {
            acl.access += attribute;
        }
        const acl_list = this.state.acl_list;
        const updated_acl_list = [];
        for (const all_acl of acl_list) {
            if (all_acl && all_acl.acl) {
                if (all_acl.acl === acl.acl) {
                    updated_acl_list.push(acl);
                } else {
                    updated_acl_list.push(all_acl);
                }
            }
        }
        this.setState({acl_list: updated_acl_list});
        this.update_parent(updated_acl_list);
    }
    getAccess(acl, attribute) {
        return attribute;
    }
    getTitle(acl, attribute) {
        let str = "do not have ";
        if (acl && acl.access && acl.access.indexOf(attribute) >= 0) {
            str = "have ";
        }
        if (attribute === "R") str += "read access";
        else if (attribute === "W") str += "write access";
        else if (attribute === "D") str += "delete access";
        else if (attribute === "M") str += "the ability to change permissions";
        return str;
    }
    getAclClassName(acl, attribute) {
        if (acl && ((acl.access && acl.access.indexOf(attribute) >= 0) || (acl.acl === 'R'))) {
            return "acl-access";
        } else {
            return "acl-no-access";
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>acl-setup.js: Something went wrong.</h1>;
        }
        return (
            <div>

                <div className="acl-setup-role-block">
                    <div className="role-label">ACLs
                        <span className="filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.selectedFilter}
                                                                 onChange={(event) => { this.setState({selectedFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({selectedFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="role-area">
                        {
                            this.getAcls().map((acl, i) => {
                                return (<div key={i} className="acl-box" title={(acl.isUser ? "user " : "group ") + acl.acl}>
                                    <span className="acl-name" onClick={() => this.removeAcl(acl)}>
                                        <span className="user-group-image-box"><img className="user-group-image" src={acl.isUser ? "../images/user.svg" : "../images/group.svg"} alt="user"/></span><span>{acl.acl}</span>
                                    </span>
                                    <span className={this.getAclClassName(acl, "R")} title={this.getTitle(acl, "R")}>{this.getAccess(acl, "R")}</span>
                                    <span className={this.getAclClassName(acl, "W")} title={this.getTitle(acl, "W")} onClick={(event) => this.invertAccess(event, acl, "W")}>{this.getAccess(acl, "W")}</span>
                                    <span className={this.getAclClassName(acl, "D")} title={this.getTitle(acl, "D")} onClick={(event) => this.invertAccess(event, acl, "D")}>{this.getAccess(acl, "D")}</span>
                                    <span className={this.getAclClassName(acl, "M")} title={this.getTitle(acl, "M")} onClick={(event) => this.invertAccess(event, acl, "M")}>{this.getAccess(acl, "M")}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

                <div className="acl-setup-role-block-2">
                    <div className="role-label">available
                        <span className="available-filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.availableFilter}
                                                                 onChange={(event) => { this.setState({availableFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({availableFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="role-area">
                        {
                            this.getAvailableGroupsOrUsers().map((u_group, i) => {
                                return (<div key={i} className="user-name" onClick={() => this.addAcl(u_group)} title={(u_group.isUser ? "user " : "group ") + u_group.name}>
                                    <span className="user-group-image-box"><img className="user-group-image" src={u_group.isUser ? "../images/user.svg" : "../images/group.svg"} alt="user"/></span><span>{u_group.name}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default AclSetup;
