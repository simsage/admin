import React, {Component} from 'react';

import '../css/user-selector.css';


// select users from a list of available ones
export class UserSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            userIdList: props.user_id_List ? props.user_id_List: [],
            selectedFilter: '',
            availableFilter: '',
        };
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            userIdList: props.user_id_List ? props.user_id_List: [],
        })
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    update_parent(user_id_list) {
        if (this.props.onChange) {
            this.props.onChange(user_id_list);
        }
    }
    getUserMap() {
        const map = {};
        const user_list = this.getAllUsers();
        for (const user of user_list) {
            map[user.id] = user;
        }
        return map;
    }
    getUserFullName(user) {
        return user.email;
    }
    removeUserFromGroup(user_id) {
        const new_users = [];
        for (const e_user_id of this.state.userIdList) {
            if (e_user_id !== user_id) {
                new_users.push(e_user_id);
            }
        }
        this.setState({userIdList: new_users});
        this.update_parent(new_users);
    }
    addUserToGroup(user_id) {
        const userIdList = JSON.parse(JSON.stringify(this.state.userIdList));
        userIdList.push(user_id);
        this.setState({userIdList: userIdList});
        this.update_parent(userIdList);
    }
    getAllUsers() {
        return this.props.user_list ? this.props.user_list : [];
    }
    getAvailableUsers() {
        const list = [];
        const filter = this.state.availableFilter.trim().toLowerCase();
        for (const user of this.getAllUsers()) {
            let found = false;
            for (const e_user_id of this.state.userIdList) {
                if (user.id === e_user_id) {
                    found = true;
                }
            }
            if (!found) {
                const user_name = this.getUserFullName(user);
                if (filter.length === 0 || user_name.toLowerCase().indexOf(filter) >= 0)
                    list.push(user);
            }
        }
        return list;
    }
    getSelectedUsers() {
        const user_map = this.getUserMap();
        const user_id_list = this.state.userIdList ? this.state.userIdList : [];
        const user_list = [];
        const filter = this.state.selectedFilter.trim().toLowerCase();
        for (const user_id of user_id_list) {
            const user = user_map[user_id];
            if (user && user.id) {
                const user_name = this.getUserFullName(user);
                if (filter.length === 0 || user_name.toLowerCase().indexOf(filter) >= 0)
                    user_list.push(user);
            }
        }
        return user_list;
    }
    selectAll() {
        const new_users = [];
        for (const user of this.getAllUsers()) {
            new_users.push(user.id);
        }
        this.setState({userIdList: new_users});
        this.update_parent(new_users);
    }
    clearAll() {
        this.setState({userIdList: []});
        this.update_parent([]);
    }
    render() {
        if (this.state.has_error) {
            return <h1>user-selector.js: Something went wrong.</h1>;
        }
        return (
            <div>

                <div className="role-block">
                    <div className="role-label">selected users
                        <span className="filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.selectedFilter}
                                                                 onChange={(event) => { this.setState({selectedFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({selectedFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="role-area">
                        {
                            this.getSelectedUsers().map((user) => {
                                const user_name = this.getUserFullName(user);
                                return (<div key={user.id} className="user-name" onClick={() => this.removeUserFromGroup(user.id)} title={user_name}>
                                    <span className="user-group-image-box"><img className="user-group-image" src="images/user.svg" alt="user"/></span><span>{user_name}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

                <div className="role-controls">
                    <div className="button" title="move all to selected users" onClick={() => this.selectAll()}>&lt;&lt;</div>
                    <div className="button" title="move all to available users" onClick={() => this.clearAll()}>&gt;&gt;</div>
                </div>

                <div className="role-block">
                    <div className="role-label">available users
                        <span className="filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={this.state.availableFilter}
                                                                 onChange={(event) => { this.setState({availableFilter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => this.setState({availableFilter: ''})}>&times;</span>
                        </span>
                    </div>
                    <div className="role-area">
                        {
                            this.getAvailableUsers().map((user) => {
                                const user_name = this.getUserFullName(user);
                                return (<div key={user.id} className="user-name" onClick={() => this.addUserToGroup(user.id)} title={user_name}>
                                    <span className="user-group-image-box"><img className="user-group-image" src="images/user.svg" alt="user"/></span><span>{user_name}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default UserSelector;
