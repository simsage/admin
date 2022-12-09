import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';

// 2020-01-01 00:00 GMT (without milli seconds)
const time2020 = 1577836800;


export class CrawlerGDrive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // Google-drive properties
            json_key_file: props.json_key_file ? props.json_key_file : '',
            drive_user_csv: props.drive_user_csv ? props.drive_user_csv : '',
            timeToCheckFrom: props.timeToCheckFrom ? props.timeToCheckFrom : '0',
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
            this.setState(this.construct_data({
                drive_user_csv: Api.defined(nextProps.drive_user_csv) ? nextProps.drive_user_csv : '',
                json_key_file: Api.defined(nextProps.json_key_file) ? nextProps.json_key_file : '',
                timeToCheckFrom: Api.defined(nextProps.timeToCheckFrom) ? nextProps.timeToCheckFrom : '0',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            drive_user_csv: Api.defined(data.drive_user_csv) ? data.drive_user_csv : this.state.drive_user_csv,
            json_key_file: Api.defined(data.json_key_file) ? data.json_key_file : this.state.json_key_file,
            timeToCheckFrom: Api.defined(data.timeToCheckFrom) ? data.timeToCheckFrom : this.state.timeToCheckFrom,
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
        this.setState({timeToCheckFrom: Math.floor(Date.now())});
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-gdrive.js: Something went wrong.</h1>;
        }
        let date_time_str = "complete crawl";
        if (this.state.timeToCheckFrom > time2020)
            date_time_str = Api.toPrettyDateTime(new Date(this.state.timeToCheckFrom * 1));
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="office-manual-box">
                    <a href="resources/simsage-google-drive-setup.pdf" id="dlGDrive" target="_blank" title="download the SimSage Google-drive setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="google-drive setup guide" className="image-size" />
                        </a>
                    </span>
                </div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">JSON key contents</span>
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="7"
                                          placeholder="the Google JSON key identifying the service account to use to access and impersonate user-drive data."
                                          value={this.state.json_key_file}
                                          onChange={(event) => {this.change_callback({json_key_file: event.target.value})}}
                                />
                            </form>
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">user list</span>
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of user email-addresses separated by commas whose drives to crawl"
                                          value={this.state.drive_user_csv}
                                          onChange={(event) => {this.change_callback({drive_user_csv: event.target.value})}}
                                    />
                            </form>
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">time to check from</span>
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
                                               value={this.state.timeToCheckFrom}
                                               onChange={(event) => {this.change_callback({timeToCheckFrom: event.target.value})}}
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
                    </div>
                </div>

            </div>
        );
    }
}

export default CrawlerGDrive;
