import React, {Component} from 'react';

import '../css/crawler.css';


// external crawler (ie. uses External
export class CrawlerExternal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            organisation_id: props.organisation_id,
            kb_id: props.kb_id,
            source_id: props.source_id,
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
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json
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
            return <h1>crawler-external.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">
                <div className="wp-form">
                    <div style={{padding: '20px'}}>external crawler</div>
                    <div>
                        <a href="https://github.com/simsage/example-upload" rel="noreferrer" target="_blank">Read how to upload your own external data to SimSage.</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default CrawlerExternal;
