import React, {Component} from 'react';

import Api from "../../../common/api";

import '../../../css/crawler.css';

export class CrawlerIManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // dropbox properties
            server: props.server ? props.server : '',
            username: props.username ? props.username : '',
            password: props.password ? props.password : '',
            clientId: props.clientId ? props.clientId : '',
            clientSecret: props.clientSecret ? props.clientSecret : '',
            libraryId: props.libraryId ? props.libraryId : '',
            cursor: props.cursor ? props.cursor : '0',
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
                server: Api.defined(nextProps.server) ? nextProps.server : '',
                username: Api.defined(nextProps.username) ? nextProps.username : '',
                password: Api.defined(nextProps.password) ? nextProps.password : '',
                clientId: Api.defined(nextProps.clientId) ? nextProps.clientId : '',
                clientSecret: Api.defined(nextProps.clientSecret) ? nextProps.clientSecret : '',
                libraryId: Api.defined(nextProps.libraryId) ? nextProps.libraryId : '',
                cursor: Api.defined(nextProps.cursor) ? nextProps.cursor : '0',
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
            server: Api.defined(data.server) ? data.server : this.state.server,
            username: Api.defined(data.username) ? data.username : this.state.username,
            password: Api.defined(data.password) ? data.password : this.state.password,
            clientId: Api.defined(data.clientId) ? data.clientId : this.state.clientId,
            clientSecret: Api.defined(data.clientSecret) ? data.clientSecret : this.state.clientSecret,
            libraryId: Api.defined(data.libraryId) ? data.libraryId : this.state.libraryId,
            cursor: Api.defined(data.cursor) ? data.cursor : this.state.cursor,
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
    resetCursor() {
        this.setState({cursor: '0'});
        this.change_callback({cursor: '0'});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-imanage.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">server</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                    autoFocus={true}
                                    spellCheck={false}
                                    placeholder="server FQDN (e.g. imanage.simsage.ai)"
                                    value={this.state.server}
                                    onChange={(event) => {this.change_callback({server: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="dropbox-manual-box">
                        <a href="resources/imanage-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage iManage setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="images/pdf-icon.png" alt="box setup guide" className="image-size" />
                        </a>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">admin username</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="administrator's username"
                                       value={this.state.username}
                                       onChange={(event) => {this.change_callback({username: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">admin password</span>
                        <span className="big-text">
                            <form>
                                <input type="password" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="administrator's password"
                                       value={this.state.password}
                                       onChange={(event) => {this.change_callback({password: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="client id"
                                       value={this.state.clientId}
                                       onChange={(event) => {this.change_callback({clientId: event.target.value})}}
                                />
                            </form>
                        </span>
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
                        <span className="small-label-right">library id</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       placeholder="library id (e.g. Active)"
                                       value={this.state.libraryId}
                                       onChange={(event) => {this.change_callback({libraryId: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="right-column">
                        <span className="small-label-right">Event-cursor index to check from</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "200px", marginRight: "10px"}}
                                               placeholder="event-cursor index to check from"
                                               value={this.state.cursor}
                                               onChange={(event) => {this.change_callback({cursor: event.target.value})}}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn bt-sm btn-primary" onClick={() => this.resetCursor()}>reset</button>
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

export default CrawlerIManage;
