import React, {Component} from 'react';

import Api from "../../../common/api";
import '../../../css/crawler.css';


export class CrawlerOneDrive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // office 365 properties
            tenantId: props.tenantId ? props.tenantId : '',
            clientId: props.clientId ? props.clientId : '',
            clientSecret: props.clientSecret ? props.clientSecret : '',
            redirectUrl: props.redirectUrl ? props.redirectUrl : '',

            crawlAllOfOneDrive: Api.defined(props.crawlAllOfOneDrive) ? props.crawlAllOfOneDrive : false,
            oneDriveUsersToCrawl: props.oneDriveUsersToCrawl ? props.oneDriveUsersToCrawl : '',

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
            this.setState(this.construct_data({
                tenantId: nextProps.tenantId,
                clientId: nextProps.clientId,
                clientSecret: nextProps.clientSecret,
                redirectUrl: nextProps.redirectUrl,

                crawlAllOfOneDrive: nextProps.crawlAllOfOneDrive,
                oneDriveUsersToCrawl: nextProps.oneDriveUsersToCrawl,

                specific_json: nextProps.specific_json,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,

            tenantId: Api.defined(data.tenantId) ? data.tenantId : this.state.tenantId,
            clientId: Api.defined(data.clientId) ? data.clientId : this.state.clientId,
            clientSecret: Api.defined(data.clientSecret) ? data.clientSecret : this.state.clientSecret,
            redirectUrl: Api.defined(data.redirectUrl) ? data.redirectUrl : this.state.redirectUrl,

            crawlAllOfOneDrive: Api.defined(data.crawlAllOfOneDrive) ? data.crawlAllOfOneDrive : this.state.crawlAllOfOneDrive,
            oneDriveUsersToCrawl: Api.defined(data.oneDriveUsersToCrawl) ? data.oneDriveUsersToCrawl : this.state.oneDriveUsersToCrawl,
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
            return <h1>crawler-onedrive.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="small-label-right">domain name</span>
                        <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="tenant id"
                                    autoFocus={true}
                                    value={this.state.tenantId}
                                    onChange={(event) => {this.change_callback({tenantId: event.target.value})}}
                                />
                            </form>
                        </span>
                        <span className="office-manual-box">
                            <a href="resources/simsage-exchange365-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage Exchange 365 setup guide">
                                <span className="instructions-label">instructions</span>
                                <img src="../images/pdf-icon.png" alt="exchange 365 setup guide" className="image-size" />
                            </a>
                        </span>
                    </div>
                </div>


                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="client id"
                                    value={this.state.clientId}
                                    onChange={(event) => {this.change_callback({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="right-column">
                        <span className="small-label-right">client secret</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="client secret"
                                    value={this.state.clientSecret}
                                    onChange={(event) => {this.change_callback({clientSecret: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>


                <div className="form-group">
                    <span className="full-column">
                        <span className="small-label-right">redirect url</span>
                        <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="redirect url: the SimSage interface url to return-to after MS sign-in completes."
                                    value={this.state.redirectUrl}
                                    onChange={(event) => {this.change_callback({redirectUrl: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <br/>

                <div className="form-group">
                        <span className="full-column">
                            <div style={{float: 'left'}} title="Check this box if you want ALL of OneDrive to be included">
                                <input type="checkbox"
                                       checked={this.state.crawlAllOfOneDrive}
                                       onChange={(event) => { this.change_callback({crawlAllOfOneDrive: event.target.checked}); }}
                                       value="crawl all of Exchange?"
                                />
                                <span className="label-left">crawl all of OneDrive?</span>
                            </div>
                        </span>
                </div>

                <br/>

                <div className="form-group">
                    <span className="label-right-top">or crawl specific one-drive accounts</span>
                </div>
                <div className="form-group">
                    <div className="full-column">
                        <textarea className="textarea-width"
                            placeholder="specific exchange accounts (comma separated email addresses)"
                            disabled={this.state.crawlAllOfOneDrive}
                            rows={2}
                            value={this.state.oneDriveUsersToCrawl}
                            onChange={(event) => {this.change_callback({oneDriveUsersToCrawl: event.target.value})}}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

export default CrawlerOneDrive;
