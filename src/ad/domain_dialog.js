import React, {Component} from 'react';

import TimeSelect from '../common/time-select'
import Api from "../common/api";

import '../css/domain-dialog.css';

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
            edge_device_list: this.props.edge_device_list,

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
                    edge_device_list: nextProps.edge_device_list,

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
                edgeDeviceId: Api.defined(domain.edgeDeviceId) ? domain.edgeDeviceId : '',
            }
        } else {
            return {
                organisationId: '', kbId: '',
                domainId: '', domainName: '',
                userName: '', password: '',
                serverIp: '', basePath: '',
                portNumber: 389, sslOn: false,
                schedule: '', edgeDeviceId: '',
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
            edgeDeviceId: this.state.edgeDeviceId,
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

    filteredEdgeDevices() {
        let list = [{"key": "none", "value": "n/a"}];
        if (this.props.edge_device_list) {
            for (let edge_device of this.props.edge_device_list) {
                if (edge_device.organisationId === this.state.organisation_id && edge_device.edgeId) {
                    list.push({"key": edge_device.edgeId, "value": edge_device.name});
                }
            }
        }
        return list;
    }

    render() {
        if (this.state.has_error) {
            return <h1>domain-dialog.js: Something went wrong.</h1>;
        }
        const theme = this.props.theme;
        const tabStyle = (theme === 'light' ? '.tab' : 'tab_dark');
        const t_value = this.state.selectedTab;
        if (!this.state.open) {
            return (<div />);
        }
        return (
            <div className="domain-dialog">
                <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                    <div className={"modal-dialog modal-dialog-centered modal-xl " + tabStyle} role="document">
                        <div className="modal-content shadow p-3 mb-5 bg-white rounded domain-dialog-height">
                            <div className="modal-header">
                                <h5 className={"modal-title " + theme}>{this.props.title}</h5>
                                <button type="button" className="btn btn-primary btn-block close"  onClick={() => this.handleCancel()}
                                        data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <ul className="nav nav-tabs">
                                    <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'general' ? 'active' : '')}
                                            onClick={() => this.setState({selectedTab: 'general'})}>general</div>
                                    </li>
                                    <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'schedule' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'schedule'})}>schedule</div>
                                    </li>
                                </ul>

                                {t_value === 'general' &&
                                <div className="domain-page">

                                    <div className="control-row">
                                        <span className="label-2">domain name</span>
                                        <span className="text">
                                            <form>
                                                <input type="text"
                                                    autoFocus={true}
                                                    aria-placeholder="domain name"
                                                    value={this.state.domainName}
                                                    onChange={(event) => {this.change_callback({domainName: event.target.value})}}
                                                    className="form-control"
                                                    />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">user name</span>
                                        <span className="text">
                                            <form>
                                                <input type="text"
                                                       aria-placeholder="user name"
                                                       value={this.state.userName}
                                                       onChange={(event) => {this.change_callback({userName: event.target.value})}}
                                                       className="form-control"
                                                    />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">password</span>
                                        <span className="text">
                                            <form>
                                                <input type="password"
                                                   aria-placeholder="password (leave blank not to change)"
                                                   value={this.state.password}
                                                   onChange={(event) => {this.change_callback({password: event.target.value})}}
                                                   className="form-control"
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">domain ip</span>
                                        <span className="text">
                                            <form>
                                                <input type="text"
                                                   aria-placeholder="domain ip-address"
                                                   value={this.state.serverIp}
                                                   onChange={(event) => {this.change_callback({serverIp: event.target.value})}}
                                                   className="form-control"
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">domain base path</span>
                                        <span className="text">
                                            <form>
                                                <input type="text"
                                                   aria-placeholder="domain base-path (e.g. dc=my-domain,dc=co,dc=uk)"
                                                   value={this.state.basePath}
                                                   onChange={(event) => {this.change_callback({basePath: event.target.value})}}
                                                   className="form-control"
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">port number</span>
                                        <span className="text">
                                            <form>
                                                <input type="text"
                                                   aria-placeholder="Active Directory port-number"
                                                   value={this.state.portNumber}
                                                   onChange={(event) => {this.change_callback({portNumber: event.target.value})}}
                                                   className="form-control"
                                                />
                                            </form>
                                        </span>
                                    </div>

                                    <div className="control-row">
                                        <span className="label-2">edge device</span>
                                        <span className="text">
                                            <form>
                                                <select
                                                    value={this.state.edgeDeviceId !== '' ? this.state.edgeDeviceId : 'none'}
                                                    onChange={(event) => {
                                                        this.change_callback({edgeDeviceId: event.target.value})
                                                    }}>
                                                {
                                                    this.filteredEdgeDevices().map((value) => {
                                                        return (<option key={value.key} value={value.key}>{value.value}</option>)
                                                    })
                                                }
                                                </select>
                                            </form>
                                        </span>
                                    </div>


                                    <div className="control-row">
                                        <span className="label-2">SSL?</span>
                                        <span className="short-checkbox">
                                            <input type="checkbox"
                                                   checked={this.state.sslOn}
                                                   onChange={(event) => {
                                                       if (!event.target.checked) {
                                                           this.change_callback({sslOn: false});
                                                       } else {
                                                           this.change_callback({sslOn: event.target.checked});
                                                       }
                                                   }}
                                                   value="enable Active Directory SSL?"
                                            />
                                        </span>
                                        <span className="explanation-label">Check this box if you want the enable SSL communications with the Active Directory server.</span>
                                    </div>

                                    <div className="control-box">
                                        <button className="btn btn-primary btn-block" onClick={() => this.testConnection()}>Test Connection</button>
                                    </div>

                                </div>
                                }


                                {t_value === 'schedule' &&
                                    <div className="time-tab-content">
                                        <TimeSelect time={this.state.schedule}
                                                    onSave={(time) => this.updateSchedule(time)}/>
                                    </div>
                                }

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary btn-block" onClick={() => this.handleCancel()} data-dismiss="modal">cancel</button>
                                <button type="button" className="btn btn-primary btn-block" onClick={() => this.handleSave()}>save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DomainDialog;
