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


export class CrawlerGDrive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // Google-drive properties
            gdrive_projectId: props.gdrive_projectId ? props.gdrive_projectId : '',
            gdrive_clientId: props.gdrive_clientId ? props.gdrive_clientId : '',
            gdrive_clientSecret: props.gdrive_clientSecret ? props.gdrive_clientSecret : '',
            gdrive_clientName: props.gdrive_clientName ? props.gdrive_clientName : '',
            gdrive_clientPort: props.gdrive_clientPort ? props.gdrive_clientPort : '',
            gdrive_userList: Api.defined(props.gdrive_userList) ? props.gdrive_userList : '',
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
                gdrive_projectId: Api.defined(nextProps.gdrive_projectId) ? nextProps.gdrive_projectId : '',
                gdrive_clientId: Api.defined(nextProps.gdrive_clientId) ? nextProps.gdrive_clientId : '',
                gdrive_clientSecret: Api.defined(nextProps.gdrive_clientSecret) ? nextProps.gdrive_clientSecret : '',
                gdrive_clientName: Api.defined(nextProps.gdrive_clientName) ? nextProps.gdrive_clientName : '',
                gdrive_clientPort: Api.defined(nextProps.gdrive_clientPort) ? nextProps.gdrive_clientPort : '',
                gdrive_userList: Api.defined(nextProps.gdrive_userList) ? nextProps.gdrive_userList : '',
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            gdrive_projectId: Api.defined(data.gdrive_projectId) ? data.gdrive_projectId : this.state.gdrive_projectId,
            gdrive_clientId: Api.defined(data.gdrive_clientId) ? data.gdrive_clientId : this.state.gdrive_clientId,
            gdrive_clientSecret: Api.defined(data.gdrive_clientSecret) ? data.gdrive_clientSecret : this.state.gdrive_clientSecret,
            gdrive_clientName: Api.defined(data.gdrive_clientName) ? data.gdrive_clientName : this.state.gdrive_clientName,
            gdrive_clientPort: Api.defined(data.gdrive_clientPort) ? data.gdrive_clientPort : this.state.gdrive_clientPort,
            gdrive_userList: Api.defined(data.gdrive_userList) ? data.gdrive_userList : this.state.gdrive_userList,
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
        for (const user_id of this.state.gdrive_userList.split(",")) {
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
        for (const user_id of this.state.gdrive_userList.split(",")) {
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
        for (const user_id of this.state.gdrive_userList.split(",")) {
            if (user_id && user_id !== removeUser.id) {
                new_list.push(user_id);
            }
        }
        this.change_callback({gdrive_userList: new_list.join()});
    }
    addUser(user) {
        let new_list = this.state.gdrive_userList;
        if (new_list.length > 0) {
            new_list = new_list + ',' + user.id
        } else {
            new_list = user.id
        }
        this.change_callback({gdrive_userList: new_list});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-gdrive.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>

                <Grid container spacing={2}>

                    <Grid item xs={1} />
                    <Grid item xs={7}>
                        <TextField
                            placeholder="client Id"
                            label="client Id"
                            variant="outlined"
                            value={this.state.gdrive_clientId}
                            onChange={(event) => {this.change_callback({gdrive_clientId: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <div style={styles.manualBox}>
                            <a href="../resources/simsage-google-drive-setup.pdf" id="dlGDrive" target="_blank" title="download the SimSage Google-drive setup guide">
                                <div style={styles.dlText}>download Google-drive configuration instructions</div>
                                <img src="../images/pdf-icon.png" alt="google-drive setup guide" style={styles.manualImage}/>
                            </a>
                        </div>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="client Secret"
                            label="client Secret"
                            variant="outlined"
                            value={this.state.gdrive_clientSecret}
                            onChange={(event) => {this.change_callback({gdrive_clientSecret: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="project Id"
                            label="project Id"
                            variant="outlined"
                            value={this.state.gdrive_projectId}
                            onChange={(event) => {this.change_callback({gdrive_projectId: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="client Name"
                            label="client Name"
                            variant="outlined"
                            value={this.state.gdrive_clientName}
                            onChange={(event) => {this.change_callback({gdrive_clientName: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="local web port"
                            label="local web port"
                            variant="outlined"
                            value={this.state.gdrive_clientPort}
                            onChange={(event) => {this.change_callback({gdrive_clientPort: event.target.value})}}
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

export default CrawlerGDrive;
