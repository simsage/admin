import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';

export class CrawlerDiscourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // discourse properties
            server: props.server ? props.server : '',
            apiToken: props.apiToken ? props.apiToken : '',
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
                apiToken: Api.defined(nextProps.apiToken) ? nextProps.apiToken : '',
                server: Api.defined(nextProps.server) ? nextProps.server : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            apiToken: Api.defined(data.apiToken) ? data.apiToken : this.state.apiToken,
            server: Api.defined(data.server) ? data.server : this.state.server,
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
            return <h1>crawler-discourse.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">server hostname</span>
                        <span className="big-text">
                            <input type="text" className="form-control textarea-width"
                                   autoFocus={true}
                                   placeholder="server (e.g. discourse.simsage.ai)"
                                   value={this.state.server}
                                   onChange={(event) => {this.change_callback({server: event.target.value})}}
                            />
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">api token</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                    spellCheck={false}
                                    placeholder="api token"
                                    value={this.state.apiToken}
                                    onChange={(event) => {this.change_callback({apiToken: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="dropbox-manual-box">
                        <a href="resources/discourse-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Discourse setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="images/pdf-icon.png" alt="discourse setup guide" className="image-size" />
                        </a>
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerDiscourse;
