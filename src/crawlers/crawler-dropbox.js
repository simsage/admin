import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';

export class CrawlerDropbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // dropbox properties
            clientToken: props.clientToken ? props.clientToken : '',
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
                clientToken: Api.defined(nextProps.clientToken) ? nextProps.clientToken : '',
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
            clientToken: Api.defined(data.clientToken) ? data.clientToken : this.state.clientToken,
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
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dropbox.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">client token</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                    autoFocus={true}
                                    spellCheck={false}
                                    placeholder="client token"
                                    value={this.state.clientToken}
                                    onChange={(event) => {this.change_callback({clientToken: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="dropbox-manual-box">
                        <a href="../resources/simsage-dropbox-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Dropbox setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="dropbox setup guide" className="image-size" />
                        </a>
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

export default CrawlerDropbox;
