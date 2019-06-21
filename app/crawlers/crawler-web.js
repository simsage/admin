import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';


const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '700px',
    },
};


export class CrawlerWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onError: props.onError,
            onSave: props.onSave,

            // web specific
            web_base_url: props.web_base_url ? props.web_base_url : '',
            web_css: props.web_css ? props.web_css : '',
            web_extension_filter: props.web_extension_filter ? props.web_extension_filter : '',
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
    componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({web_base_url: nextProps.web_base_url,
                web_css: nextProps.web_css,
                web_extension_filter: nextProps.web_extension_filter,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {web_base_url: data.web_base_url ? data.web_base_url : this.state.web_base_url,
            web_css: data.web_css ? data.web_css : this.state.web_css,
            web_extension_filter: data.web_extension_filter ? data.web_extension_filter : this.state.web_extension_filter,
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
            return <h1>crawler-web.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                <TextField
                    placeholder="http/s base name list"
                    multiline={true}
                    rows="5"
                    label="http/s base name list"
                    value={this.state.web_base_url}
                    onChange={(event) => {this.change_callback({web_base_url: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    label="file extension csv list (excluding html/html)"
                    value={this.state.web_extension_filter}
                    onChange={(event) => {this.change_callback({web_extension_filter: event.target.value})}}
                    style={styles.textField}
                />
                <br />

                <TextField
                    placeholder="css/html root fragments"
                    multiline={true}
                    rows="5"
                    label="css/html root fragments"
                    value={this.state.web_css}
                    onChange={(event) => {this.change_callback({web_css: event.target.value})}}
                    style={styles.textField}
                />

            </div>
        );
    }
}

export default CrawlerWeb;
