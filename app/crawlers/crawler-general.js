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

            organisation_id: Api.defined(props.organisation_id) ? props.organisation_id : '',
            kb_id: Api.defined(props.kb_id) ? props.kb_id : '',
            sourceId: Api.defined(props.sourceId) ? props.sourceId : '0',

            name: Api.defined(props.name) ? props.name : '',
            filesPerSecond: Api.defined(props.filesPerSecond) ? props.filesPerSecond : '0',
            crawlerType: Api.defined(props.crawlerType) ? props.crawlerType : 'none',
            deleteFiles: props.deleteFiles,
            allowAnonymous: props.allowAnonymous,
            enablePreview: props.enablePreview,
            enableIndexing: props.enableIndexing,
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
            this.setState(this.construct_data({
                            filesPerSecond: nextProps.filesPerSecond,
                            crawlerType: nextProps.crawlerType,
                            deleteFiles: nextProps.deleteFiles,
                            allowAnonymous: nextProps.allowAnonymous,
                            enablePreview: nextProps.enablePreview,
                            enableIndexing: nextProps.enableIndexing,
                            organisation_id: nextProps.organisation_id,
                            kb_id: nextProps.kb_id,
                            sourceId: nextProps.sourceId,
                            name: nextProps.name,
                            onSave: nextProps.onSave,

                            onError: nextProps.onError,
                            error_title: nextProps.error_title,
                            error_msg: nextProps.error_msg,
                        }));
        }
    }
    construct_data(data) {
        const crawlerType = Api.defined(data.crawlerType) ? data.crawlerType : this.state.crawlerType;
        const allowAnonymous = (Api.defined(data.allowAnonymous) ? data.allowAnonymous : this.state.allowAnonymous) || (crawlerType === 'web');
        return {filesPerSecond: Api.defined(data.filesPerSecond) ? data.filesPerSecond : this.state.filesPerSecond,
                crawlerType: crawlerType,
                deleteFiles: Api.defined(data.deleteFiles) ? data.deleteFiles : this.state.deleteFiles,
                allowAnonymous: allowAnonymous,
                enablePreview: Api.defined(data.enablePreview) ? data.enablePreview : this.state.enablePreview,
                enableIndexing: Api.defined(data.enableIndexing) ? data.enableIndexing : this.state.enableIndexing,
                name: Api.defined(data.name) ? data.name : this.state.name,
                sourceId: Api.defined(data.sourceId) ? data.sourceId : this.state.sourceId,
            };
    }
    setError(title, error_msg) {
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
        if (this.props.schedule === "") {
            this.setState({
                message_callback: (action) => this.confirmDocumentsDelete(action),
                message_title: 'remove all documents for "' + this.state.name + '"?',
                message: 'Are you sure you want to remove ALL DOCUMENTS for <b>' + this.state.name + '</b>?'
            });
        } else {
            this.setError("ERROR: disable schedule", "Please clear the crawler's scheduled times first.");
        }
    }
    confirmDocumentsDelete(action) {
        this.setState({message: '', message_title: ''});
        if (action) {
            Api.deleteCrawlerDocuments(this.state.organisation_id, this.state.kb_id, this.state.sourceId,
                (response) => {},
                (err) => {
                    this.setError("Error removing all documents", err);
                });
        }
    }
    testCrawler() {
        const name = this.state.name;
        Api.testCrawler(this.state.organisation_id, this.state.kb_id, this.state.sourceId,
            (response) => {
                this.setState({
                    message_callback: (action) => { this.setState({message_title: '', message: ''})},
                    message_title: 'Crawler Test',
                    message: 'Success!  crawler "' + name + '" can communicate with its intended end-point.'
                });
            },
            (err) => {
                console.log("crawler-test error:");
                console.log(err);
                this.setError("Error Testing Crawler", err);
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
                <div style={{float: 'left'}} title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automtically from SimSage.">
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

                <br/>
                <div style={{float: 'left'}} title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">
                    <Checkbox
                        checked={this.state.allowAnonymous || this.state.crawlerType === 'web'}
                        disabled={this.state.crawlerType === 'web'}
                        onChange={(event) => { this.change_callback({allowAnonymous: event.target.checked}); }}
                        value="allow anonymous access to these files?"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                    allow anonymous access to these files?
                </div>
                <br clear="both" />

                <br/>
                <div style={{float: 'left'}} title="Check this box if you want the content of this source to be searchable.">
                    <Checkbox
                        checked={this.state.enableIndexing}
                        onChange={(event) => {
                            if (!event.target.checked) {
                                this.change_callback({enablePreview: false, enableIndexing: false});
                            } else {
                                this.change_callback({enableIndexing: event.target.checked});
                            }
                        }}
                        value="enable document search?"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                    enable document search?
                </div>
                <br clear="both" />

                <br/>
                <div style={{float: 'left'}} title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                    <Checkbox
                        checked={this.state.enablePreview}
                        disabled={!this.state.enableIndexing}
                        onChange={(event) => { this.change_callback({enablePreview: event.target.checked}); }}
                        value="enable document image previews?"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                    enable document image previews?
                </div>
                <br clear="both" />

                {this.state.sourceId && this.state.sourceId > 0 &&
                <div>
                    <Button color="primary" variant="outlined" style={styles.exportButton}
                            onClick={() => this.deleteDocuments()}>Remove Documents</Button>
                    <Button color="secondary" variant="outlined" style={styles.exportButton}
                            onClick={() => this.testCrawler()}>Test Connection</Button>
                </div>
                }
            </div>
        );
    }
}

export default CrawlerGeneral;
