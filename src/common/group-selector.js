import React, {Component} from 'react';

import '../css/group-selector.css';


// select users from a list of available ones
export class GroupSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            selected_group_list: props.selected_group_list ? props.selected_group_list: [],
            selectedFilter: '',
            availableFilter: '',
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            selected_group_list: props.selected_group_list ? props.selected_group_list: [],
        })
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    update_parent(selected_group_list) {
        if (this.props.onChange) {
            this.props.onChange(selected_group_list);
        }
    }
    removeUserOrGroup(group) {
        const new_groups = [];
        for (const s_group of this.state.selected_group_list) {
            if (s_group.name !== group.name) {
                new_groups.push(s_group);
            }
        }
        this.setState({selected_group_list: new_groups});
        this.update_parent(new_groups);
    }
    addUserOrGroup(group) {
        const selected_group_list = JSON.parse(JSON.stringify(this.state.selected_group_list));
        selected_group_list.push(group);
        this.setState({selected_group_list: selected_group_list});
        this.update_parent(selected_group_list);
    }
    getAllGroups() {
        return this.props.group_list ? this.props.group_list : [];
    }
    getAllUsers() {
        return this.props.user_list ? this.props.user_list : [];
    }
    getAvailableGroupsAndUsers() {
        const list = [];
        const filter = this.state.availableFilter.trim().toLowerCase();
        for (const group of this.getAllGroups()) {
            let found = false;
            for (const s_group of this.state.selected_group_list) {
                if (group.name === s_group.name) {
                    found = true;
                }
            }
            if (!found) {
                if (filter.length === 0 || group.name.toLowerCase().indexOf(filter) >= 0)
                    group.isUser = false;
                    list.push(group);
            }
        }
        if (this.props.include_users) {
            for (const user of this.getAllUsers()) {
                let found = false;
                for (const s_user of this.state.selected_group_list) {
                    if (user.email === s_user.name) {
                        found = true;
                    }
                }
                if (!found) {
                    if (filter.length === 0 || user.email.toLowerCase().indexOf(filter) >= 0)
                        list.push({
                            organisationId: this.props.organisation_id,
                            name: user.email,
                            id: user.id,
                            isUser: true
                        });
                }
            }
        }
        return list;
    }
    getSelectedGroups() {
        const group_list = this.state.selected_group_list ? this.state.selected_group_list : [];
        const selected_group_list = [];
        const filter = this.state.selectedFilter.trim().toLowerCase();
        for (const group of group_list) {
            if (group && group.name) {
                if (filter.length === 0 || group.name.toLowerCase().indexOf(filter) >= 0)
                    selected_group_list.push(group);
            }
        }
        return selected_group_list;
    }
    selectAll() {
        const new_groups = [];
        for (const group of this.getAllGroups()) {
            new_groups.push(group);
        }
        this.setState({selected_group_list: new_groups});
        this.update_parent(new_groups);
    }
    clearAll() {
        this.setState({selected_group_list: []});
        this.update_parent([]);
    }
    render() {
        if (this.state.has_error) {
            return <h1>group-selector.js: Something went wrong.</h1>;
        }
        return (
            <div>

                <div className="group-block">
                    <div className="group-label">selected groups
                        <span className="filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.selectedFilter}
                                                                 onChange={(event) => { this.setState({selectedFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({selectedFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="group-area">
                        {
                            this.getSelectedGroups().map((item, i) => {
                                return (<div key={i} className="user-name" onClick={() => this.removeUserOrGroup(item)} title={item.name + (item.isUser ? " (user)" : " (group)")}>
                                    <span className="user-group-image-box"><img className="user-group-image" src={item.isUser ? "images/user.svg" : "images/group.svg"} alt="user"/></span><span>{item.name}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

                <div className="group-controls">
                    <div className="button" title="move all to selected groups" onClick={() => this.selectAll()}>&lt;&lt;</div>
                    <div className="button" title="move all to available groups" onClick={() => this.clearAll()}>&gt;&gt;</div>
                </div>

                <div className="group-block">
                    <div className="group-label">available groups
                        <span className="filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.availableFilter}
                                                                 onChange={(event) => { this.setState({availableFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({availableFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="group-area">
                        {
                            this.getAvailableGroupsAndUsers().map((item, i) => {
                                return (<div key={i} className="user-name" onClick={() => this.addUserOrGroup(item)} title={item.name + (item.isUser ? " (user)" : " (group)")}>
                                    <span className="user-group-image-box"><img className="user-group-image" src={item.isUser ? "images/user.svg" : "images/group.svg"} alt="user"/></span><span>{item.name}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default GroupSelector;
