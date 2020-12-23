import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TimeSelect from '../common/time-select'
import TextField from "@material-ui/core/TextField";
import Api from "../common/api";
import Checkbox from "@material-ui/core/Checkbox";


const styles = {
    formContent: {
        overflowY: 'scroll',
        height: '550px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    domainPage: {
        padding: '10px',
    },
    textField: {
        marginLeft: '10px',
        marginRight: '10px',
        width: '500px',
    },
    timeTabContent: {
        marginLeft: '20px',
    },
    testButton: {
        marginLeft: '20px',
        marginTop: '20px',
        marginRight: '20px',
    },
};

export class DomainDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,

            onSave: props.onSave,  // save callback
            onTest: props.onTest,   // test button callback
            onUpdate: props.onUpdate, // update callback

            onError: props.onError,
            error_title: props.error_title,
            error_msg: props.error_msg,

            selectedTab: 'general',

            // organisational details
            organisation_id: props.organisation_id,
            kb_id: props.kb_id,

            ...this.construct_data(props.domain),

            has_error: false,
        }
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps !== null) {
            if (nextProps.domain) {
                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onUpdate: nextProps.onUpdate,
                    onTest: nextProps.onTest,

                    onError: nextProps.onError,
                    error_title: nextProps.error_title,
                    error_msg: nextProps.error_msg,

                    organisation_id: nextProps.organisation_id,
                    kb_id: nextProps.kb_id,

                    ...this.construct_data(nextProps.domain)
                });

            } else {
                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onError: nextProps.onError,
                });
            }
        }
    }

    change_callback(data) {
        this.setState(data);
    }

    construct_data(domain) {
        if (domain) {
            return {
                organisationId: '', kbId: '',
                domainId: Api.defined(domain.domainId) ? domain.domainId : '',
                domainName: Api.defined(domain.domainName) ? domain.domainName : '',
                userName: Api.defined(domain.userName) ? domain.userName : '',
                password: Api.defined(domain.password) ? domain.password : '',
                serverIp: Api.defined(domain.serverIp) ? domain.serverIp : '',
                basePath: Api.defined(domain.basePath) ? domain.basePath : '',
                portNumber: Api.defined(domain.portNumber) ? domain.portNumber : 389,
                sslOn: Api.defined(domain.sslOn) ? domain.sslOn : false,
                schedule: Api.defined(domain.schedule) ? domain.schedule : '',
            }
        } else {
            return {
                organisationId: '', kbId: '',
                domainId: '', domainName: '',
                userName: '', password: '',
                serverIp: '', basePath: '',
                portNumber: 389, sslOn: false,
                schedule: '',
            }
        }
    }

    gather_data() {
        return {
            organisationId: '', kbId: '',
            domainId: this.state.domainId,
            domainName: this.state.domainName,
            userName: this.state.userName,
            password: this.state.password,
            serverIp: this.state.serverIp,
            basePath: this.state.basePath,
            portNumber: this.state.portNumber,
            sslOn: this.state.sslOn,
            schedule: this.state.schedule,
        }
    }

    setError(title, error_msg) {
        if (this.props.onError) {
            this.props.onError(title, error_msg);
        }
    }

    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
        this.setState({open: false});
    };

    handleSave() {
        if (this.state.userName.trim().length === 0 && (
            this.state.password.trim().length === 0 ||
            this.state.domainName.trim().length === 0 ||
            this.state.serverIp.trim().length === 0 ||
            this.state.portNumber.trim().length === 0 ||
            this.state.basePath.trim().length === 0)) {

            this.setError('invalid parameters', 'you must supply credentials, and domain details using all fields.');

        } else {
            if (this.state.onSave) {
                this.state.onSave(this.gather_data());
            }
        }
    }

    testConnection() {
        if (this.state.userName.trim().length === 0 && (
            this.state.password.trim().length === 0 ||
            this.state.domainName.trim().length === 0 ||
            this.state.serverIp.trim().length === 0 ||
            this.state.portNumber.trim().length === 0 ||
            this.state.basePath.trim().length === 0)) {

            this.setError('invalid parameters', 'you must supply credentials, and domain details using all fields.');

        } else {
            if (this.state.onTest) {
                this.state.onTest(this.gather_data());
            }
        }
    }

    updateSchedule(time) {
        if (time !== null) {
            this.setState({schedule: time});
            if (this.state.onUpdate) {
                this.state.onUpdate({...this.gather_data(), "schedule": time});
            }
        }
    }

    render() {
        if (this.state.has_error) {
            return <h1>domain-dialog.js: Something went wrong.</h1>;
        }
        const t_value = this.state.selectedTab;
        return (
            <div>
                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.open}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="lg"
                        onClose={this.handleCancel.bind(this)} >
                    <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                    <div>
                        <div>
                            <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                                <Tab label="domain settings" value="general" style={styles.tab} />
                                <Tab label="schedule" value="schedule" style={styles.tab} />
                            </Tabs>

                            <div style={styles.formContent}>
                                {t_value === 'general' &&
                                    <div style={styles.domainPage}>

                                        <TextField
                                            autoFocus={true}
                                            placeholder="domain name"
                                            label="domain name"
                                            value={this.state.domainName}
                                            onChange={(event) => {this.change_callback({domainName: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <TextField
                                            placeholder="user-name"
                                            label="user-name"
                                            value={this.state.userName}
                                            onChange={(event) => {this.change_callback({userName: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <TextField
                                            placeholder="password (leave blank not to change)"
                                            label="password (leave blank not to change)"
                                            type="password"
                                            value={this.state.password}
                                            onChange={(event) => {this.change_callback({password: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <TextField
                                            placeholder="domain ip-address"
                                            label="domain ip-address"
                                            value={this.state.serverIp}
                                            onChange={(event) => {this.change_callback({serverIp: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <TextField
                                            placeholder="domain base-path (e.g. dc=my-domain,dc=co,dc=uk)"
                                            label="domain base-path (e.g. dc=my-domain,dc=co,dc=uk)"
                                            value={this.state.basePath}
                                            onChange={(event) => {this.change_callback({basePath: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <TextField
                                            placeholder="Active Directory port-number"
                                            label="Active Directory port-number"
                                            value={this.state.portNumber}
                                            onChange={(event) => {this.change_callback({portNumber: event.target.value})}}
                                            style={styles.textField}
                                        />
                                        <br />
                                        <br />

                                        <div style={{float: 'left'}} title="Check this box if you want the enable SSL communications with the Active Directory server.">
                                            <Checkbox
                                                checked={this.state.sslOn}
                                                onChange={(event) => {
                                                    if (!event.target.checked) {
                                                        this.change_callback({sslOn: false});
                                                    } else {
                                                        this.change_callback({sslOn: event.target.checked});
                                                    }
                                                }}
                                                value="enable Active Directory SSL?"
                                                inputProps={{
                                                    'aria-label': 'primary checkbox',
                                                }}
                                            />
                                            enable Active Directory SSL?
                                        </div>
                                        <br clear="both" />

                                        <Button color="primary" variant="outlined" style={styles.testButton}
                                                onClick={() => this.testConnection()}>Test Connection</Button>


                                    </div>
                                }
                                {t_value === 'schedule' &&
                                <div style={styles.timeTabContent}>
                                    <TimeSelect time={this.state.schedule}
                                                onSave={(time) => this.updateSchedule(time)}/>
                                </div>
                                }
                            </div>


                        </div>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.handleCancel()}>cancel</Button>
                        <Button onClick={() => this.handleSave()}>save</Button>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}

export default DomainDialog;
