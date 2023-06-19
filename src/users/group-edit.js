import React, {Component} from 'react';

import UserSelector from "../common/user-selector";


export class GroupEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,

            onSave: props.onSave,
            onError: props.onError,

            name: props.group && props.group.name ? props.group.name : "",
            userIdList: props.group && props.group.userIdList ? props.group.userIdList: [],
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    getAllUsers() {
        return this.props.user_list ? this.props.user_list : [];
    }
    getUserMap() {
        const map = {};
        const user_list = this.getAllUsers();
        for (const user of user_list) {
            map[user.id] = user;
        }
        return map;
    }
    handleSave() {
        if (this.state.onSave) {
            const final_user_id_list = [];
            const user_map = this.getUserMap();
            for (const user_id of this.state.userIdList) {
                const user = user_map[user_id];
                if (user && user.id) {
                    final_user_id_list.push(user_id);
                }
            }
            this.state.onSave({"name": this.state.name, "userIdList": final_user_id_list});
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

            name: props.group && props.group.name ? props.group.name : "",
            userIdList: props.group && props.group.userIdList ? props.group.userIdList: [],
        })
    }

    render() {
        if (this.state.has_error) {
            return <h1>group-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl min-width"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit Group</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">group name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                            autoFocus={true}
                                            onChange={(event) => this.setState({name: event.target.value})}
                                            placeholder="name"
                                            value={this.state.name}
                                        />
                                    </span>
                                </div>

                                <UserSelector
                                    user_list={this.props.user_list}
                                    user_id_List={this.state.userIdList}
                                    onChange={(user_id_list) => this.setState({userIdList: user_id_list})}
                                />

                            </div>
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

export default GroupEdit;
