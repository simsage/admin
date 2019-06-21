import React, {Component} from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const crawler_list = [
    {"key": "none", "value": "please select crawler type"},
    {"key": "file", "value": "file crawler"},
    {"key": "web", "value": "web crawler"},
];


const styles = {
    customWidth: {
        width: 450,
        marginBottom: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '500px',
        marginBottom: '50px',
    },
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
};


export class CrawlerGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,  // save data
            onError: props.onError,

            name: props.name ? props.name : '',
            filesPerSecond: props.filesPerSecond ? props.filesPerSecond : '0',
            crawlerType: props.crawlerType ? props.crawlerType : 'none',
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
            this.setState(this.construct_data({filesPerSecond: nextProps.filesPerSecond,
                            crawlerType: nextProps.crawlerType,
                            name: nextProps.name,
                            onSave: nextProps.onSave,
                            onError: nextProps.onError,
                        }));
        }
    }
    construct_data(data) {
        return {filesPerSecond: data.filesPerSecond ? data.filesPerSecond : this.state.filesPerSecond,
                crawlerType: data.crawlerType ? data.crawlerType : this.state.crawlerType,
                name: data.name ? data.name : this.state.name,
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
            return <h1>crawler-general.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                <Select
                    value={this.state.crawlerType}
                    style={styles.customWidth}
                    onChange={(event) => {this.change_callback({crawlerType: event.target.value})}}>
                    {
                        crawler_list.map((value) => {
                            return (<MenuItem key={value.key} value={value.key}>{value.value}</MenuItem>)
                        })
                    }
                </Select>

                <br/>
                <br/>
                <TextField
                    placeholder="Crawler Name"
                    autoFocus
                    label="Crawler Name"
                    value={this.state.name}
                    style={styles.textField}
                    onChange={(event) => {this.change_callback({name: event.target.value})}}
                />
                <div>how many files per second should we limit the system to</div>
                <TextField
                    type="number"
                    placeholder="files per second throttle"
                    label="files per second throttle"
                    value={this.state.filesPerSecond}
                    onChange={(event) => {this.change_callback({filesPerSecond: event.target.value})}}
                />
                <br/>
            </div>
        );
    }
}

export default CrawlerGeneral;
