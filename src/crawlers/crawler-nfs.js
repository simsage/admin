import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

import Api from '../common/api';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";


const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        width: '100%',
    },
    dlText: {
        marginTop: '-2px',
        width: '250px',
        float: 'left',
    },
    manualBox: {
        width: '100%',
    },
    manualImage: {
        float: 'left',
        width: '40px',
    },
    roleBlock: {
        padding: '5px',
        border: '1px solid #888',
        borderRadius: '4px',
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


export class CrawlerNFS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // Google-drive properties
            nfs_local_folder: props.nfs_local_folder ? props.nfs_local_folder : '',
            nfs_userList: Api.defined(props.nfs_userList) ? props.nfs_userList : '',
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
                nfs_local_folder: Api.defined(nextProps.nfs_local_folder) ? nextProps.nfs_local_folder : '',
                nfs_userList: Api.defined(nextProps.nfs_userList) ? nextProps.nfs_userList : '',
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            nfs_local_folder: Api.defined(data.nfs_local_folder) ? data.nfs_local_folder : this.state.nfs_local_folder,
            nfs_userList: Api.defined(data.nfs_userList) ? data.nfs_userList : this.state.nfs_userList,
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
        for (const user_id of this.state.nfs_userList.split(",")) {
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
        for (const user_id of this.state.nfs_userList.split(",")) {
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
        for (const user_id of this.state.nfs_userList.split(",")) {
            if (user_id && user_id !== removeUser.id) {
                new_list.push(user_id);
            }
        }
        this.change_callback({nfs_userList: new_list.join()});
    }
    addUser(user) {
        let new_list = this.state.nfs_userList;
        if (new_list.length > 0) {
            new_list = new_list + ',' + user.id
        } else {
            new_list = user.id
        }
        this.change_callback({nfs_userList: new_list});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-nfs.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>

                <Grid container spacing={2}>

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="local folder"
                            label="Local Folder"
                            variant="outlined"
                            value={this.state.nfs_local_folder}
                            onChange={(event) => {this.change_callback({nfs_local_folder: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
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
                    </Grid>
                    <Grid item xs={5}>
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
                    </Grid>
                    <Grid item xs={1} />

                </Grid>

            </div>
        );
    }
}

export default CrawlerNFS;
