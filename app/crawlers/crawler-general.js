import React, {Component} from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import MessageDialog from "../common/message-dialog";
import {Api} from "../common/api";

const crawler_list = [
    {"key": "none", "value": "please select crawler type"},
    {"key": "file", "value": "file crawler"},
    {"key": "web", "value": "web crawler"},
    //{"key": "database", "value": "database crawler"},
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
    exportButton: {
        marginTop: '50px',
        marginRight: '20px',
    },
};


export class CrawlerGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,  // save data
            onError: props.onError,
            error_title: props.error_title,
            error_msg: props.error_msg,

            // messages
            message_callback: null,
            message: '',
            message_title: '',

            organisation_id: props.organisation_id ? props.organisation_id : '',
            kb_id: props.kb_id ? props.kb_id : '',
            id: props.id ? props.id : '',

            name: props.name ? props.name : '',
            filesPerSecond: props.filesPerSecond ? props.filesPerSecond : '0',
            crawlerType: props.crawlerType ? props.crawlerType : 'none',
            deleteFiles: props.deleteFiles,
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
            this.setState(this.construct_data({
                            filesPerSecond: nextProps.filesPerSecond,
                            crawlerType: nextProps.crawlerType,
                            deleteFiles: nextProps.deleteFiles,
                            organisation_id: nextProps.organisation_id,
                            kb_id: nextProps.kb_id,
                            id: nextProps.id,
                            name: nextProps.name,
                            onSave: nextProps.onSave,

                            onError: nextProps.onError,
                            error_title: nextProps.error_title,
                            error_msg: nextProps.error_msg,
                        }));
        }
    }
    construct_data(data) {
        return {filesPerSecond: data.filesPerSecond ? data.filesPerSecond : this.state.filesPerSecond,
                crawlerType: data.crawlerType ? data.crawlerType : this.state.crawlerType,
                deleteFiles: (data.deleteFiles !== undefined) ? data.deleteFiles : this.state.deleteFiles,
                name: data.name ? data.name : this.state.name,
            };
    }
    showError(title, error_msg) {
        if (this.props.onError) {
            this.props.onError(title, error_msg);
        }
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(data));
        }
    }
    deleteDocuments() {
        this.setState({
            message_callback: (action) => this.confirmDocumentsDelete(action),
            message_title: 'remove all documents for "' + this.state.name + '"?',
            message: 'Are you sure you want to remove ALL DOCUMENTS for <b>' + this.state.name + '</b>?'
        });
    }
    confirmDocumentsDelete(action) {
        this.setState({message: '', message_title: ''});
        if (action) {
            Api.deleteCrawlerDocuments(this.state.organisation_id, this.state.kb_id, this.state.id,
                (response) => {},
                (err) => {
                    this.showError("Error removing all documents", err);
                });
        }
    }
    testCrawler() {
        Api.testCrawler(this.state.organisation_id, this.state.kb_id, this.state.id,
            (response) => {
                this.setState({
                    message_callback: (action) => { this.setState({message_title: '', message: ''})},
                    message_title: 'Crawler Test',
                    message: 'Success!  Working!'
                });
            },
            (err) => {
                console.log("crawler-test error:");
                console.log(err);
                this.showError("Error Testing Crawler", err);
            });
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-general.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

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
                <TextField
                    placeholder="files per second throttle"
                    label="files per second throttle"
                    value={this.state.filesPerSecond}
                    onChange={(event) => {this.change_callback({filesPerSecond: event.target.value})}}
                />
                <br/>
                <br/>
                <div style={{float: 'left'}}>
                    <Checkbox
                        checked={this.state.deleteFiles}
                        onChange={(event) => { this.change_callback({deleteFiles: event.target.checked}); }}
                        value="delete files?"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                    remove un-seen files?
                </div>
                <br clear="both" />

                {this.state.id && this.state.id.length > 0 &&
                <div>
                    <Button color="primary" variant="outlined" style={styles.exportButton}
                            onClick={() => this.deleteDocuments()}>Remove Documents</Button>
                    <Button color="secondary" variant="outlined" style={styles.exportButton}
                            onClick={() => this.testCrawler()}>Test</Button>
                </div>
                }
            </div>
        );
    }
}

export default CrawlerGeneral;
