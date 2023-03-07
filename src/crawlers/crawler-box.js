import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';

// 2020-01-01 00:00 GMT (without milli seconds)
const time2020 = 1577836800;

export class CrawlerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // dropbox properties
            clientId: props.clientId ? props.clientId : '',
            clientSecret: props.clientSecret ? props.clientSecret : '',
            enterpriseId: props.enterpriseId ? props.enterpriseId : '',
            deltaIndicator: props.deltaIndicator ? props.deltaIndicator : '0',
            folderList: props.folderList ? props.folderList : '',
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
                clientId: Api.defined(nextProps.clientId) ? nextProps.clientId : '',
                clientSecret: Api.defined(nextProps.clientSecret) ? nextProps.clientSecret : '',
                enterpriseId: Api.defined(nextProps.enterpriseId) ? nextProps.enterpriseId : '',
                deltaIndicator: Api.defined(nextProps.deltaIndicator) ? nextProps.deltaIndicator : '0',
                folderList: Api.defined(nextProps.folderList) ? nextProps.folderList : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            clientId: Api.defined(data.clientId) ? data.clientId : this.state.clientId,
            clientSecret: Api.defined(data.clientSecret) ? data.clientSecret : this.state.clientSecret,
            enterpriseId: Api.defined(data.enterpriseId) ? data.enterpriseId : this.state.enterpriseId,
            deltaIndicator: Api.defined(data.deltaIndicator) ? data.deltaIndicator : this.state.deltaIndicator,
            folderList: Api.defined(data.folderList) ? data.folderList : this.state.folderList,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }
    setTimeToNow() {
        this.setState({deltaIndicator: Math.floor(Date.now() / 1000)});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dropbox.js: Something went wrong.</h1>;
        }
        let date_time_str = "complete crawl";
        if (this.state.deltaIndicator > time2020)
            date_time_str = Api.toPrettyDateTime(new Date(this.state.deltaIndicator * 1000));
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                    autoFocus={true}
                                    spellCheck={false}
                                    placeholder="client id"
                                    value={this.state.clientId}
                                    onChange={(event) => {this.change_callback({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="dropbox-manual-box">
                        <a href="resources/simsage-box-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Box setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="box setup guide" className="image-size" />
                        </a>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client secret</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="client secret"
                                       value={this.state.clientSecret}
                                       onChange={(event) => {this.change_callback({clientSecret: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">enterprise id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="enterprise id"
                                       value={this.state.enterpriseId}
                                       onChange={(event) => {this.change_callback({enterpriseId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">time to check from</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "200px", marginRight: "10px"}}
                                               placeholder="time to check from"
                                               value={this.state.deltaIndicator}
                                               onChange={(event) => {this.change_callback({deltaIndicator: event.target.value})}}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn bt-sm btn-primary" onClick={() => this.setTimeToNow()}>now</button>
                                    </td>
                                    <td>
                                        <div style={{width: "200px", marginLeft: "30px"}}>{date_time_str}</div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group small-text-with-width">
                    You can enter multiple folders separated by commas.  Each folder must be part of the root folder and not contain any sub-folders.
                    You can leave this entry empty to crawl all folders.  Each folder name must start with '/'.
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">start folder</span>
                        <span className="big-text">
                            <input type="text" className="form-control textarea-width"
                                      value={this.state.folderList}
                                      onChange={(event) => {this.change_callback({folderList: event.target.value})}}
                            />
                        </span>
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerBox;
