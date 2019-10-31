import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Api from '../common/api'

const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '500px',
    },
};


export class CrawlerFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // file specific
            file_username: Api.defined(props.file_username) ? props.file_username : '',
            file_password: Api.defined(props.file_password) ? props.file_password : '',
            file_server: Api.defined(props.file_server) ? props.file_server : '',
            file_domain: Api.defined(props.file_domain) ? props.file_domain : '',
            file_share_name: Api.defined(props.file_share_name) ? props.file_share_name : '',
            file_share_path: Api.defined(props.file_share_path) ? props.file_share_path : '',
        };

    }
    componentDidMount() {
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
            this.setState(this.construct_data({file_username: nextProps.file_username,
                file_password: nextProps.file_password,
                file_domain: nextProps.file_domain,
                file_server: nextProps.file_server,
                file_share_name: nextProps.file_share_name,
                file_share_path: nextProps.file_share_path,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {file_username: Api.defined(data.file_username) ? data.file_username : this.state.file_username,
            file_password: Api.defined(data.file_password) ? data.file_password : this.state.file_password,
            file_domain: Api.defined(data.file_domain) ? data.file_domain : this.state.file_domain,
            file_server: Api.defined(data.file_server) ? data.file_server : this.state.file_server,
            file_share_name: Api.defined(data.file_share_name) ? data.file_share_name : this.state.file_share_name,
            file_share_path: Api.defined(data.file_share_path) ? data.file_share_path : this.state.file_share_path,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(data));
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-file.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                <TextField
                    placeholder="user name"
                    label="user name"
                    value={this.state.file_username}
                    onChange={(event) => {this.change_callback({file_username: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="password"
                    label="password"
                    type="password"
                    value={this.state.file_password}
                    onChange={(event) => {this.change_callback({file_password: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="domain (leave blank for default or no domain)"
                    label="domain"
                    value={this.state.file_domain}
                    onChange={(event) => {this.change_callback({file_domain: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="server (hostname or ip-address)"
                    label="server"
                    value={this.state.file_server}
                    onChange={(event) => {this.change_callback({file_server: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="share name"
                    label="share name"
                    value={this.state.file_share_name}
                    onChange={(event) => {this.change_callback({file_share_name: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="path inside share (optional)"
                    label="path inside share"
                    value={this.state.file_share_path}
                    onChange={(event) => {this.change_callback({file_share_path: event.target.value})}}
                    style={styles.textField}
                />
                <br />


            </div>
        );
    }
}

export default CrawlerFile;
