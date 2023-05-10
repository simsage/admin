import React, {Component} from 'react';

import Api from "../../../common/api";

import '../../../css/crawler.css';


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
            specific_json: props.specific_json,
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
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            gdrive_projectId: Api.defined(data.gdrive_projectId) ? data.gdrive_projectId : this.state.gdrive_projectId,
            gdrive_clientId: Api.defined(data.gdrive_clientId) ? data.gdrive_clientId : this.state.gdrive_clientId,
            gdrive_clientSecret: Api.defined(data.gdrive_clientSecret) ? data.gdrive_clientSecret : this.state.gdrive_clientSecret,
            gdrive_clientName: Api.defined(data.gdrive_clientName) ? data.gdrive_clientName : this.state.gdrive_clientName,
            gdrive_clientPort: Api.defined(data.gdrive_clientPort) ? data.gdrive_clientPort : this.state.gdrive_clientPort,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-gdrive.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="small-label-right">client id</span>
                        <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                       placeholder="client id"
                                       value={this.state.gdrive_clientId}
                                       onChange={(event) => {this.change_callback({gdrive_clientId: event.target.value})}}
                                />
                            </form>
                        </span>
                        <span className="office-manual-box">
                        <a href="resources/simsage-google-drive-setup.pdf" id="dlGDrive" target="_blank" title="download the SimSage Google-drive setup guide">
                                <span className="instructions-label">instructions</span>
                                <img src="images/pdf-icon.png" alt="google-drive setup guide" className="image-size" />
                            </a>
                        </span>
                    </div>
                </div>


                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client secret</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="client Secret"
                                    value={this.state.gdrive_clientSecret}
                                    onChange={(event) => {this.change_callback({gdrive_clientSecret: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">project id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="project id"
                                    value={this.state.gdrive_projectId}
                                    onChange={(event) => {this.change_callback({gdrive_projectId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client name</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="client name"
                                    value={this.state.gdrive_clientName}
                                    onChange={(event) => {this.change_callback({gdrive_clientName: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>


                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">local web port</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="local web port"
                                    value={this.state.gdrive_clientPort}
                                    onChange={(event) => {this.change_callback({gdrive_clientPort: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerGDrive;
