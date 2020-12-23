import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

import Api from '../common/api';
import Chip from "@material-ui/core/Chip";


const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '700px',
    },
    dlText: {
        marginTop: '-2px',
        width: '150px',
        float: 'left',
    },
    manualBox: {
        float: 'right',
        marginRight: '100px',
    },
    manualImage: {
        float: 'left',
        width: '40px',
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
};


export class CrawlerDropbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // dropbox properties
            clientToken: props.clientToken ? props.clientToken : '',
            folderList: props.folderList ? props.folderList : '',
            userList: Api.defined(props.userList) ? props.userList : '',
        };

    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({tenantId: nextProps.tenantId,
                clientToken: Api.defined(nextProps.clientToken) ? nextProps.clientToken : '',
                folderList: Api.defined(nextProps.folderList) ? nextProps.folderList : '',
                userList: Api.defined(nextProps.userList) ? nextProps.userList : '',
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            clientToken: Api.defined(data.clientToken) ? data.clientToken : this.state.clientToken,
            folderList: Api.defined(data.folderList) ? data.folderList : this.state.folderList,
            userList: Api.defined(data.userList) ? data.userList : this.state.userList,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }
    getSelectedUsers() {
        const selectedUsers = {};
        for (const user_id of this.state.userList.split(",")) {
            if (user_id) {
                selectedUsers[user_id] = true;
            }
        }
        const user_list = [];
        for (const user of this.props.availableUserList) {
            if (user.id && selectedUsers[user.id]) {
                user_list.push(user);
            }
        }
        return user_list;
    }
    getAvailableUsers() {
        const selectedUsers = {};
        for (const user_id of this.state.userList.split(",")) {
            if (user_id) {
                selectedUsers[user_id] = true;
            }
        }
        const user_list = [];
        for (const user of this.props.availableUserList) {
            if (user.id && !selectedUsers[user.id]) {
                user_list.push(user);
            }
        }
        return user_list;
    }
    removeUser(removeUser) {
        const new_list = [];
        for (const user_id of this.state.userList.split(",")) {
            if (user_id && user_id !== removeUser.id) {
                new_list.push(user_id);
            }
        }
        this.change_callback({userList: new_list.join()});
    }
    addUser(user) {
        let new_list = this.state.userList;
        if (new_list.length > 0) {
            new_list = new_list + ',' + user.id
        } else {
            new_list = user.id
        }
        this.change_callback({userList: new_list});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dropbox.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                <TextField
                    placeholder="client token"
                    label="client token"
                    value={this.state.clientToken}
                    onChange={(event) => {this.change_callback({clientToken: event.target.value})}}
                    style={styles.textField}
                />

                <div style={styles.manualBox}>
                    <a href="../resources/simsage-dropbox-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Dropbox setup guide">
                        <div style={styles.dlText}>download Dropbox configuration instructions</div>
                        <img src="../images/pdf-icon.png" alt="dropbox setup guide" style={styles.manualImage}/></a>
                </div>

                <br />
                <br />

                <TextField
                    placeholder="specific folders to crawl (separated by commas), leave empty to crawl all."
                    label="specific folders to crawl (separated by commas), leave empty to crawl all."
                    multiline={true}
                    rows={5}
                    value={this.state.folderList}
                    onChange={(event) => {this.change_callback({folderList: event.target.value})}}
                    style={styles.textField}
                />
                <br />

                <div>
                    <div style={styles.roleBlock}>
                        <div style={styles.roleLabel}>users with access</div>
                        <div style={styles.roleArea}>
                            {
                                this.getSelectedUsers().map((user) => {
                                    return (<Chip key={user.id} color="secondary"
                                                  style={styles.roleChip}
                                                  onClick={() => this.removeUser(user)}
                                                  label={user.firstName + ' ' + user.surname} variant="outlined" />)
                                })
                            }
                        </div>
                    </div>
                    <div style={styles.roleBlock}>
                        <div style={styles.roleLabel}>available users</div>
                        <div style={styles.roleArea}>
                            {
                                this.getAvailableUsers().map((user) => {
                                    return (<Chip key={user.id} color="primary"
                                                  style={styles.roleChip}
                                                  onClick={() => this.addUser(user)}
                                                  label={user.firstName + ' ' + user.surname} variant="outlined" />)
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default CrawlerDropbox;
