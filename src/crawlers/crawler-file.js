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
        width: '670px',
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
            username: Api.defined(props.username) ? props.username : '',
            password: Api.defined(props.password) ? props.password : '',
            server: Api.defined(props.server) ? props.server : '',
            domain: Api.defined(props.domain) ? props.domain : '',
            fqdn: Api.defined(props.fqdn) ? props.fqdn : '',
            shareName: Api.defined(props.shareName) ? props.shareName : '',
            sharePath: Api.defined(props.sharePath) ? props.sharePath : '',
            specific_json: props.specific_json,
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
            this.setState(this.construct_data({username: nextProps.username,
                password: nextProps.password,
                domain: nextProps.domain,
                fqdn: nextProps.fqdn,
                server: nextProps.server,
                shareName: nextProps.shareName,
                sharePath: nextProps.sharePath,
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            username: Api.defined(data.username) ? data.username : this.state.username,
            password: Api.defined(data.password) ? data.password : this.state.password,
            domain: Api.defined(data.domain) ? data.domain : this.state.domain,
            fqdn: Api.defined(data.fqdn) ? data.fqdn : this.state.fqdn,
            server: Api.defined(data.server) ? data.server : this.state.server,
            shareName: Api.defined(data.shareName) ? data.shareName : this.state.shareName,
            sharePath: Api.defined(data.sharePath) ? data.sharePath : this.state.sharePath,
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
                    value={this.state.username}
                    onChange={(event) => {this.change_callback({username: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="password"
                    label="password"
                    type="password"
                    value={this.state.password}
                    onChange={(event) => {this.change_callback({password: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    label="domain (leave blank for default or no domain)"
                    placeholder="domain name"
                    value={this.state.domain}
                    onChange={(event) => {this.change_callback({domain: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    label="Fully Qualified Domain Name"
                    placeholder="e.g.  simsage.ai  (this will form your user's email addresses, eg. account-name@simsage.ai)"
                    value={this.state.fqdn}
                    onChange={(event) => {this.change_callback({fqdn: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="server (hostname or ip-address)"
                    label="server"
                    value={this.state.server}
                    onChange={(event) => {this.change_callback({server: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="share name"
                    label="share name"
                    value={this.state.shareName}
                    onChange={(event) => {this.change_callback({shareName: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="path inside share (optional)"
                    label="path inside share"
                    value={this.state.sharePath}
                    onChange={(event) => {this.change_callback({sharePath: event.target.value})}}
                    style={styles.textField}
                />
                <br />


            </div>
        );
    }
}

export default CrawlerFile;
