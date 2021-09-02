import React, {Component} from 'react';

import MessageDialog from "../common/message-dialog";
import {Api} from "../common/api";

import '../css/crawler.css';

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


export class CrawlerGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,  // save data
            onError: props.onError,

            // messages
            message_callback: null,
            message: '',
            message_title: '',

            organisation_id: Api.defined(props.organisation_id) ? props.organisation_id : '',
            kb_id: Api.defined(props.kb_id) ? props.kb_id : '',
            sourceId: Api.defined(props.sourceId) ? props.sourceId : '0',
            nodeId: Api.defined(props.nodeId) ? props.nodeId : '0',
            maxItems: Api.defined(props.maxItems) ? props.maxItems : '0',
            maxQNAItems: Api.defined(props.maxQNAItems) ? props.maxQNAItems : '0',

            name: Api.defined(props.name) ? props.name : '',
            filesPerSecond: Api.defined(props.filesPerSecond) ? props.filesPerSecond : '0',
            crawlerType: Api.defined(props.crawlerType) && props.crawlerType.length > 0 ? props.crawlerType : 'none',
            deleteFiles: props.deleteFiles,
            allowAnonymous: props.allowAnonymous,
            enablePreview: props.enablePreview,
            processingLevel: props.processingLevel,
            customRender: props.customRender,
            edge_device_list: this.props.edge_device_list,

            edgeDeviceId: Api.defined(props.edgeDeviceId) && props.edgeDeviceId.length > 0 ? props.edgeDeviceId : 'none',
            qaMatchStrength: Api.defined(props.qaMatchStrength) && props.qaMatchStrength ? props.qaMatchStrength : 0.8125,
            numResults: Api.defined(props.numResults) && props.numResults ? props.numResults : 5,
            numFragments: Api.defined(props.numFragments) && props.numFragments ? props.numFragments : 3,
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
                            organisation_id: nextProps.organisation_id,
                            kb_id: nextProps.kb_id,
                            sourceId: nextProps.sourceId,
                            nodeId: nextProps.nodeId,
                            maxItems: nextProps.maxItems,
                            maxQNAItems: nextProps.maxQNAItems,
                            processingLevel: nextProps.processingLevel,
                            customRender: nextProps.customRender,
                            edgeDeviceId: Api.defined(nextProps.edgeDeviceId) ? nextProps.edgeDeviceId : 'none',
                            qaMatchStrength: Api.defined(nextProps.qaMatchStrength) ? nextProps.qaMatchStrength : 0.8125,
                            numResults: Api.defined(nextProps.numResults) ? nextProps.numResults : 5,
                            numFragments: Api.defined(nextProps.numFragments) ? nextProps.numFragments : 3,

                            name: nextProps.name,
                            onSave: nextProps.onSave,
                            edge_device_list: nextProps.edge_device_list,

                            onError: nextProps.onError,
                        }));
        }
    }
    construct_data(data) {
        const crawlerType = Api.defined(data.crawlerType) ? data.crawlerType : this.state.crawlerType;
        const allowAnonymous = (Api.defined(data.allowAnonymous) ? data.allowAnonymous : this.state.allowAnonymous) || (crawlerType === 'web');
        let edgeDeviceId = Api.defined(data.edgeDeviceId) ? data.edgeDeviceId : this.state.edgeDeviceId;
        if (edgeDeviceId === 'none' || !this.canHaveEdgeDevice()) edgeDeviceId = '';
        return {filesPerSecond: Api.defined(data.filesPerSecond) ? data.filesPerSecond : this.state.filesPerSecond,
                organisationId: Api.defined(data.organisationId) ? data.organisationId : this.state.organisationId,
                crawlerType: crawlerType,
                deleteFiles: Api.defined(data.deleteFiles) ? data.deleteFiles : this.state.deleteFiles,
                allowAnonymous: allowAnonymous,
                enablePreview: Api.defined(data.enablePreview) ? data.enablePreview : this.state.enablePreview,
                processingLevel: Api.defined(data.processingLevel) ? data.processingLevel : this.state.processingLevel,
                name: Api.defined(data.name) ? data.name : this.state.name,
                sourceId: Api.defined(data.sourceId) ? data.sourceId : this.state.sourceId,
                nodeId: Api.defined(data.nodeId) ? data.nodeId : this.state.nodeId,
                maxItems: Api.defined(data.maxItems) ? data.maxItems : this.state.maxItems,
                maxQNAItems: Api.defined(data.maxQNAItems) ? data.maxQNAItems : this.state.maxQNAItems,
                customRender: Api.defined(data.customRender) ? data.customRender : this.state.customRender,
                edgeDeviceId: edgeDeviceId,
                qaMatchStrength: Api.defined(data.qaMatchStrength) ? data.qaMatchStrength : this.state.qaMatchStrength,
                numResults: Api.defined(data.numResults) ? data.numResults : this.state.numResults,
                numFragments: Api.defined(data.numFragments) ? data.numFragments : this.state.numFragments,
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
            () => {
                this.setState({
                    message_callback: () => { this.setState({message_title: '', message: ''})},
                    message_title: 'Crawler Test',
                    message: 'Success!  crawler "' + name + '" can communicate with its intended end-point.'
                });
            },
            (err) => {
                console.log(err);
                this.setError("Error Testing Crawler", err);
            });
    }
    canHaveEdgeDevice() {
        const crawlerType = this.state.crawlerType;
        return crawlerType !== 'office365' && crawlerType !== 'wordpress' && crawlerType !== 'gdrive';
    }
    setProcessingLevelFromMark(value) {
        if (this.state.onSave) {
            this.state.onSave(this.construct_data({"processingLevel": value}));
        }
    }
    filteredEdgeDevices() {
        let list = [{"key": "none", "value": "n/a"}];
        if (this.props.edge_device_list) {
            for (let edge_device of this.props.edge_device_list) {
                if (edge_device.organisationId === this.state.organisation_id && edge_device.edgeId) {
                    list.push({"key": edge_device.edgeId, "value": edge_device.name});
                }
            }
        }
        return list;
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-general.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page-form">

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               theme={this.props.theme}
                               message={this.state.message}
                               title={this.state.message_title} />

                <div className="crawler-page">

                    <div className="type-select-box">
                        <select className="form-select customWidth" onChange={(event) => {this.change_callback({crawlerType: event.target.value})}}
                                disabled={("" + this.state.sourceId) !== "0"}
                                defaultValue={this.state.crawlerType}>
                            {
                                crawler_list.map((value) => {
                                    return (<option key={value.key} value={value.key}>{value.value}</option>)
                                })
                            }
                        </select>
                    </div>


                    <div className="processing-selector">
                        <span className="label-processing">processing level:</span>
                        <span title="Select what kind of processing you want done to these files" className="processing-list">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("FILES")}
                                       id="inlineRadio1" value="FILES" checked={this.state.processingLevel === "FILES"} />
                                <label className="form-check-label" htmlFor="inlineRadio1">discovery</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("GDPR")}
                                       id="inlineRadio2" value="GDPR" checked={this.state.processingLevel === "GDPR"} />
                                <label className="form-check-label" htmlFor="inlineRadio2">GDPR</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("SEARCH")}
                                       id="inlineRadio3" value="SEARCH" checked={this.state.processingLevel === "SEARCH"} />
                                <label className="form-check-label" htmlFor="inlineRadio3">search</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("NLU")}
                                       id="inlineRadio4" value="lang" disabled />
                                <label className="form-check-label" htmlFor="inlineRadio3">NLU</label>
                            </div>

                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <input type="text" className="form-control"
                                placeholder="Crawler Name"
                                autoFocus
                                value={this.state.name}
                                onChange={(event) => {this.change_callback({name: event.target.value})}}
                            />
                        </span>
                        <span className="right-column">
                            <span className="label-right">files per second throttle</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="files per second throttle"
                                    value={this.state.filesPerSecond}
                                    onChange={(event) => {this.change_callback({filesPerSecond: event.target.value})}}
                                />
                            </span>
                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right">maximum number of files</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                placeholder="Maximum number of files (0 for no limits)"
                                value={this.state.maxItems}
                                onChange={(event) => {this.change_callback({maxItems: event.target.value})}}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            <span className="label-right">maximum number of QA</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="Maximum number of QA entries (0 for no limits)"
                                    value={this.state.maxQNAItems}
                                    onChange={(event) => {this.change_callback({maxQNAItems: event.target.value})}}
                                />
                            </span>
                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right">node id</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="node-id (0 for single node systems)"
                                    value={this.state.nodeId}
                                    onChange={(event) => {this.change_callback({nodeId: event.target.value})}}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            {(this.state.crawlerType === 'database' || this.state.crawlerType === 'restfull') &&
                            <div>
                                <div
                                     title="Restful and DB crawlers have optional custom-rendering flags.">
                                    <input type="checkbox"
                                        checked={this.state.customRender && (this.state.crawlerType === 'database' || this.state.crawlerType === 'restfull')}
                                        onChange={(event) => {
                                            this.change_callback({customRender: event.target.checked && (this.state.crawlerType === 'database' || this.state.crawlerType === 'restfull')});
                                        }}
                                        value="custom render?"
                                    />
                                    <span className="label-left">custom render?</span>
                                </div>
                            </div>
                            }
                            {(this.state.crawlerType !== 'database' && this.state.crawlerType !== 'restfull') &&
                            <div />
                            }
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}} title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                                <input type="checkbox"
                                    checked={this.state.deleteFiles}
                                    onChange={(event) => { this.change_callback({deleteFiles: event.target.checked}); }}
                                    value="delete files?"
                                />
                                <span className="label-left">remove un-seen files?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <div style={{float: 'left'}} title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">
                                <input type="checkbox"
                                    checked={this.state.allowAnonymous || this.state.crawlerType === 'web'}
                                    disabled={this.state.crawlerType === 'web'}
                                    onChange={(event) => { this.change_callback({allowAnonymous: event.target.checked}); }}
                                    value="allow anonymous access to these files?"
                                />
                                <span className="label-left">allow anonymous access to these files?</span>
                            </div>
                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}} title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                                <input type="checkbox"
                                    checked={this.state.enablePreview && (this.state.processingLevel === "SEARCH" || this.state.processingLevel === "NLU")}
                                    disabled={this.state.processingLevel !== "SEARCH" && this.state.processingLevel !== "NLU"}
                                    onChange={(event) => { this.change_callback({enablePreview: event.target.checked}); }}
                                    value="enable document image previews?"
                                />
                                <span className="label-left">enable document image previews?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <span className="label-right">number of search results</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="number of search results"
                                    value={this.state.numResults}
                                    onChange={(event) => {this.change_callback({numResults: event.target.value})}}
                                />
                            </span>
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right">number of fragments</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="number of fragments per search result"
                                    value={this.state.numFragments}
                                    onChange={(event) => {this.change_callback({numFragments: event.target.value})}}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            <span className="label-right">Q&A threshold</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                    placeholder="Q&A threshold (0.8125 default)"
                                    value={this.state.qaMatchStrength}
                                    onChange={(event) => {this.change_callback({qaMatchStrength: event.target.value})}}
                                />
                            </span>
                        </span>
                    </div>


                    {this.canHaveEdgeDevice() &&
                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right"
                                 title="you can connect this source to a SimSage Edge device if you have one.  Select it here.">
                                Edge device
                            </span>
                            <span className="select-box-after-label">
                                <select className="form-select" onChange={(event) => this.change_callback({edgeDeviceId: event.target.value})}
                                        disabled={("" + this.state.sourceId) !== "0"}
                                        defaultValue={this.state.edgeDeviceId !== '' ? this.state.edgeDeviceId : 'none'}>
                                    {
                                        this.filteredEdgeDevices().map((value) => {
                                            return (<option key={value.key} value={value.key}>{value.value}</option>)
                                        })
                                    }
                                </select>
                            </span>
                        </span>
                        <span className="right-column">
                        </span>
                    </div>
                    }


                    <div>
                        {this.state.sourceId && this.state.sourceId > 0 && this.state.crawlerType !== 'nfs' &&
                            this.state.crawlerType !== 'database' && this.state.crawlerType !== 'restfull' &&
                            this.state.crawlerType !== 'gdrive' &&
                        <div>
                            <button className="btn btn-primary btn-block"
                                    onClick={() => this.testCrawler()}>Test Connection</button>
                        </div>
                        }
                    </div>



                </div>
            </div>
        );
    }
}

export default CrawlerGeneral;
