import React, {Component} from 'react';

import '../css/crawler.css';
import Api from "../common/api";


// generic RSS crawler
export class CrawlerRss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            organisation_id: props.organisation_id,
            kb_id: props.kb_id,
            source_id: props.source_id,
            endpoint: props.endpoint ? props.endpoint : '',
            initial_feed: props.initial_feed ? props.initial_feed : '',
            specific_json: props.specific_json,
            onSave: props.onSave,
            onError: props.onError,
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
            this.setState({
                endpoint: Api.defined(nextProps.endpoint) ? nextProps.endpoint : '',
                initial_feed: Api.defined(nextProps.initial_feed) ? nextProps.initial_feed : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            endpoint: Api.defined(data.endpoint) ? data.endpoint : this.state.endpoint,
            initial_feed: Api.defined(data.initial_feed) ? data.initial_feed : this.state.initial_feed,
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
            return <h1>crawler-rss.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">
                <div className="wp-form">

                    <div style={{padding: '20px'}}>the rss-endpoint for an RSS endpoint.  This is the main endpoint for any RSS feed.  Be sure to uncheck</div>
                    <form>
                        <input type="text" className="form-control nfs-width"
                               placeholder="rss-endpoint"
                               value={this.state.endpoint}
                               onChange={(event) => {this.change_callback({endpoint: event.target.value})}}
                        />
                    </form>

                    <div style={{padding: '20px'}}>the initial-feed is an optional field for an RSS endpoint.  The contents of this RSS endpoint will be processed once when the crawler starts and
                        is meant to act as an initial set up.</div>
                    <form>
                        <input type="text" className="form-control nfs-width"
                            placeholder="initial feed"
                            value={this.state.initial_feed}
                            onChange={(event) => {this.change_callback({initial_feed: event.target.value})}}
                        />
                    </form>

                </div>
            </div>
        );
    }
}

export default CrawlerRss;
