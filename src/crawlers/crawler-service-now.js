import React, {Component} from 'react';

import Api from '../common/api';
import '../css/crawler.css';


export class CrawlerServiceNow extends Component {
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
                server: nextProps.server,
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
            server: Api.defined(data.server) ? data.server : this.state.server,
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
            return <h1>crawler-service-now.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">user name</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    autoFocus={true}
                                    placeholder="user name"
                                    value={this.state.username}
                                    onChange={(event) => {this.change_callback({username: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="right-column">
                        <span className="small-label-right">password</span>
                        <span className="big-text">
                            <form>
                                <input type="password" className="form-control"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={(event) => {this.change_callback({password: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">service-now instance name</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="service-now instance name"
                                    value={this.state.server}
                                    onChange={(event) => {this.change_callback({server: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerServiceNow;
