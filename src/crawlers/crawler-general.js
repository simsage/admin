import React, {Component} from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import MessageDialog from "../common/message-dialog";
import {Api} from "../common/api";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";

const crawler_list = [
    {"key": "none", "value": "please select crawler type"},
    {"key": "file", "value": "file crawler"},
    {"key": "web", "value": "web crawler"},
    {"key": "office365", "value": "office 365 crawler"},
    {"key": "dropbox", "value": "dropbox crawler"},
    {"key": "wordpress", "value": "WordPress external crawler"},
    {"key": "gdrive", "value": "Google-drive crawler"},
    {"key": "nfs", "value": "nfs external crawler"},
    {"key": "database", "value": "database crawler"},
    {"key": "restfull", "value": "REST-full crawler"},
];

// slider display
const marks = [
    {
        value: 0,
        label: 'File list',
    },
    {
        value: 33,
        label: 'GDPR compliance',
    },
    {
        value: 66,
        label: 'Semantic Search',
    },
    {
        value: 100,
        label: 'Language NLU',
    },
];

function markText(value) {
    if (value < 10) return "file";
    if (value < 50) return "gdpr";
    if (value < 80) return "search";
    return "lang"
}


const styles = {
    customWidth: {
        width: '48%',
    },
    textField: {
        width: '98%',
    },
    formContent: {
        marginTop: '20px',
        width: '98%',
    },
    exportButton: {
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
            nodeId: Api.defined(props.nodeId) ? props.nodeId : '0',
            maxItems: Api.defined(props.maxItems) ? props.maxItems : '0',
            maxBotItems: Api.defined(props.maxBotItems) ? props.maxBotItems : '0',

            name: Api.defined(props.name) ? props.name : '',
            filesPerSecond: Api.defined(props.filesPerSecond) ? props.filesPerSecond : '0',
            crawlerType: Api.defined(props.crawlerType) ? props.crawlerType : 'none',
            deleteFiles: props.deleteFiles,
            allowAnonymous: props.allowAnonymous,
            enablePreview: props.enablePreview,
            processingLevel: props.processingLevel,
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
                            crawlerType: Api.defined(nextProps.crawlerType) ? nextProps.crawlerType : 'none',
                            deleteFiles: nextProps.deleteFiles,
                            allowAnonymous: nextProps.allowAnonymous,
                            enablePreview: nextProps.enablePreview,
                            processingLevel: nextProps.processingLevel,
                            organisation_id: nextProps.organisation_id,
                            kb_id: nextProps.kb_id,
                            sourceId: nextProps.sourceId,
                            nodeId: nextProps.nodeId,
                            maxItems: nextProps.maxItems,
                            maxBotItems: nextProps.maxBotItems,
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
                processingLevel: Api.defined(data.processingLevel) ? data.processingLevel : this.state.processingLevel,
                name: Api.defined(data.name) ? data.name : this.state.name,
                sourceId: Api.defined(data.sourceId) ? data.sourceId : this.state.sourceId,
                nodeId: Api.defined(data.nodeId) ? data.nodeId : this.state.nodeId,
                maxItems: Api.defined(data.maxItems) ? data.maxItems : this.state.maxItems,
                maxBotItems: Api.defined(data.maxBotItems) ? data.maxBotItems : this.state.maxBotItems,
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
    processingLevelToMark() {
        if (this.state.processingLevel === "FILES") return 0;
        if (this.state.processingLevel === "GDPR") return 33;
        if (this.state.processingLevel === "SEARCH") return 66;
        return 100;
    }
    setProcessingLevelFromMark(value) {
        let processingLevel = "NLU";
        if (value === 0) processingLevel = "FILES";
        else if (value === 33) processingLevel = "GDPR";
        else if (value === 66) processingLevel = "SEARCH";
        if (this.state.onSave) {
            this.state.onSave(this.construct_data({"processingLevel": processingLevel}));
        }
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

                <Grid container spacing={2}>

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <Select
                            value={this.state.crawlerType}
                            disabled={("" + this.state.sourceId) !== "0"}
                            style={styles.customWidth}
                            onChange={(event) => {this.change_callback({crawlerType: event.target.value})}}>
                            {
                                crawler_list.map((value) => {
                                    return (<MenuItem key={value.key} value={value.key}>{value.value}</MenuItem>)
                                })
                            }
                        </Select>
                    </Grid>
                    <Grid item xs={1} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="Crawler Name"
                            autoFocus
                            label="Crawler Name"
                            value={this.state.name}
                            style={styles.textField}
                            onChange={(event) => {this.change_callback({name: event.target.value})}}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="files per second throttle"
                            label="files per second throttle"
                            value={this.state.filesPerSecond}
                            style={styles.textField}
                            onChange={(event) => {this.change_callback({filesPerSecond: event.target.value})}}
                        />
                    </Grid>
                    <Grid item xs={1} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="Maximum number of files (0 for no limits)"
                            label="Maximum number of files (0 for no limits)"
                            value={this.state.maxItems}
                            style={styles.textField}
                            onChange={(event) => {this.change_callback({maxItems: event.target.value})}}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="Maximum number of QA (Bot) entries (0 for no limits)"
                            label="Maximum number of QA (Bot) entries (0 for no limits)"
                            value={this.state.maxBotItems}
                            style={styles.textField}
                            onChange={(event) => {this.change_callback({maxBotItems: event.target.value})}}
                        />
                    </Grid>
                    <Grid item xs={1} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="node-id (0 for single node systems)"
                            label="node-id (0 for single node systems)"
                            value={this.state.nodeId}
                            style={styles.textField}
                            onChange={(event) => {this.change_callback({nodeId: event.target.value})}}
                        />
                    </Grid>
                    <Grid item xs={6} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
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
                        </Grid>
                        <Grid item xs={5}>
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
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={{float: 'left', width: '80%'}} title="Select what kind of processing you want done to these files">
                                <Slider
                                    defaultValue={this.processingLevelToMark()}
                                    valueLabelFormat={markText}
                                    getAriaValueText={markText}
                                    aria-labelledby="crawler-level"
                                    onChange={(event, newValue) => this.setProcessingLevelFromMark(newValue)}
                                    step={null}
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={{float: 'left'}} title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                                <Checkbox
                                    checked={this.state.enablePreview && (this.state.processingLevel === "SEARCH" || this.state.processingLevel === "NLU")}
                                    disabled={this.state.processingLevel !== "SEARCH" && this.state.processingLevel !== "NLU"}
                                    onChange={(event) => { this.change_callback({enablePreview: event.target.checked}); }}
                                    value="enable document image previews?"
                                    inputProps={{
                                        'aria-label': 'primary checkbox',
                                    }}
                                />
                                enable document image previews?
                            </div>
                        </ Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            {this.state.sourceId && this.state.sourceId > 0 &&
                            <div>
                                <Button color="secondary" variant="outlined" style={styles.exportButton}
                                        onClick={() => this.testCrawler()}>Test Connection</Button>
                            </div>
                            }
                        </Grid>
                        <Grid item xs={6} />

                    </Grid>
            </div>
        );
    }
}

export default CrawlerGeneral;
