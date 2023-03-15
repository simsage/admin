import React, {Component} from 'react';

import MessageDialog from "../common/message-dialog";
import {Api} from "../common/api";

import '../css/crawler.css';

// marker for an external node
const external_node_id = 1000000;

// a few defaults
const default_error_threshold = 10;
const default_num_results = 10;
const default_num_fragments = 10;
const default_qna_threshold = 0.8125;

const crawler_list = [
    {"key": "none", "value": "please select crawler type"},
    {"key": "box", "value": "Box crawler"},
    {"key": "confluence", "value": "Confluence crawler"},
    {"key": "database", "value": "Database crawler"},
    {"key": "discourse", "value": "Discourse crawler"},
    {"key": "dropbox", "value": "Dropbox crawler"},
    {"key": "exchange365", "value": "Exchange 365 crawler"},
    {"key": "external", "value": "External crawler"},
    {"key": "file", "value": "File (SMB) crawler"},
    {"key": "gdrive", "value": "Google-drive crawler"},
    {"key": "imanage", "value": "iManage crawler"},
    {"key": "nfs", "value": "NFS external crawler"},
    {"key": "onedrive", "value": "One-drive crawler"},
    {"key": "restfull", "value": "REST-full crawler"},
    {"key": "rss", "value": "RSS crawler"},
    {"key": "servicenow", "value": "Service-now crawler"},
    {"key": "sharepoint365", "value": "Sharepoint 365 crawler"},
    {"key": "web", "value": "Web crawler"},
    {"key": "wordpress", "value": "WordPress external crawler"},
    {"key": "search", "value": "Search crawler"},
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
            qaMatchStrength: Api.defined(props.qaMatchStrength) && props.qaMatchStrength ? props.qaMatchStrength : default_qna_threshold,
            numResults: Api.defined(props.numResults) && props.numResults ? props.numResults : default_num_results,
            numFragments: Api.defined(props.numFragments) && props.numFragments ? props.numFragments : default_num_fragments,
            errorThreshold: Api.defined(props.errorThreshold) && props.errorThreshold ? props.errorThreshold : default_error_threshold,
            internalCrawler: Api.defined(props.nodeId) ? props.nodeId !== external_node_id : false,
            useDefaultRelationships: props.useDefaultRelationships,
            autoOptimize: props.autoOptimize,
            storeBinary: props.storeBinary,
            versioned: props.versioned,
            writeToCassandra: props.writeToCassandra,
            enableDocumentSimilarity: props.enableDocumentSimilarity,
            documentSimilarityThreshold: props.documentSimilarityThreshold,
            isExternal: props.isExternal
        };

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
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
                qaMatchStrength: Api.defined(nextProps.qaMatchStrength) ? nextProps.qaMatchStrength : default_qna_threshold,
                numResults: Api.defined(nextProps.numResults) ? nextProps.numResults : default_num_results,
                numFragments: Api.defined(nextProps.numFragments) ? nextProps.numFragments : default_num_fragments,
                errorThreshold: Api.defined(nextProps.errorThreshold) ? nextProps.errorThreshold : default_error_threshold,
                internalCrawler: Api.defined(nextProps.nodeId) ? nextProps.nodeId !== external_node_id : false,
                useDefaultRelationships: Api.defined(nextProps.useDefaultRelationships) ? nextProps.useDefaultRelationships : true,
                autoOptimize: Api.defined(nextProps.autoOptimize) ? nextProps.autoOptimize : false,
                storeBinary: Api.defined(nextProps.storeBinary) ? nextProps.storeBinary : true,
                versioned: Api.defined(nextProps.versioned) ? nextProps.versioned : true,
                writeToCassandra: Api.defined(nextProps.writeToCassandra) ? nextProps.writeToCassandra : true,
                enableDocumentSimilarity: Api.defined(nextProps.enableDocumentSimilarity) ? nextProps.enableDocumentSimilarity : true,
                documentSimilarityThreshold: Api.defined(nextProps.documentSimilarityThreshold) ? nextProps.documentSimilarityThreshold : true,
                isExternal: Api.defined(nextProps.isExternal) ? nextProps.isExternal : false,

                name: nextProps.name,
                onSave: nextProps.onSave,
                edge_device_list: nextProps.edge_device_list,

                onError: nextProps.onError,
            }));
        }
    }

    construct_data(data) {
        const crawlerType = Api.defined(data.crawlerType) ? data.crawlerType : this.state.crawlerType;
        const allowAnonymous = (Api.defined(data.allowAnonymous) ? data.allowAnonymous : this.state.allowAnonymous);
        let edgeDeviceId = Api.defined(data.edgeDeviceId) ? data.edgeDeviceId : this.state.edgeDeviceId;
        if (edgeDeviceId === 'none' || !this.canHaveEdgeDevice()) edgeDeviceId = '';
        let deleteFiles = Api.defined(data.deleteFiles) ? data.deleteFiles : this.state.deleteFiles;
        if (crawlerType === 'rss') deleteFiles = false;
        let nodeId = Api.defined(data.nodeId) ? data.nodeId : this.state.nodeId;
        if (Api.defined(data.internalCrawler)) {
            if (data.internalCrawler && nodeId === external_node_id) {
                nodeId = 0;
            } else if (!data.internalCrawler) {
                nodeId = external_node_id;
            }
        }
        return {
            filesPerSecond: Api.defined(data.filesPerSecond) ? data.filesPerSecond : this.state.filesPerSecond,
            organisationId: Api.defined(data.organisationId) ? data.organisationId : this.state.organisationId,
            crawlerType: crawlerType,
            deleteFiles: deleteFiles,
            allowAnonymous: allowAnonymous,
            enablePreview: Api.defined(data.enablePreview) ? data.enablePreview : this.state.enablePreview,
            processingLevel: Api.defined(data.processingLevel) ? data.processingLevel : this.state.processingLevel,
            name: Api.defined(data.name) ? data.name : this.state.name,
            sourceId: Api.defined(data.sourceId) ? data.sourceId : this.state.sourceId,
            nodeId: nodeId,
            maxItems: Api.defined(data.maxItems) ? data.maxItems : this.state.maxItems,
            maxQNAItems: Api.defined(data.maxQNAItems) ? data.maxQNAItems : this.state.maxQNAItems,
            customRender: Api.defined(data.customRender) ? data.customRender : this.state.customRender,
            edgeDeviceId: edgeDeviceId,
            qaMatchStrength: Api.defined(data.qaMatchStrength) ? data.qaMatchStrength : this.state.qaMatchStrength,
            numResults: Api.defined(data.numResults) ? data.numResults : this.state.numResults,
            numFragments: Api.defined(data.numFragments) ? data.numFragments : this.state.numFragments,
            errorThreshold: Api.defined(data.errorThreshold) ? data.errorThreshold : this.state.errorThreshold,
            useDefaultRelationships: Api.defined(data.useDefaultRelationships) ? data.useDefaultRelationships : this.state.useDefaultRelationships,
            autoOptimize: Api.defined(data.autoOptimize) ? data.autoOptimize : this.state.autoOptimize,
            storeBinary: Api.defined(data.storeBinary) ? data.storeBinary : this.state.storeBinary,
            versioned: Api.defined(data.versioned) ? data.versioned : this.state.versioned,
            writeToCassandra: Api.defined(data.writeToCassandra) ? data.writeToCassandra : this.state.writeToCassandra,
            enableDocumentSimilarity: Api.defined(data.enableDocumentSimilarity) ? data.enableDocumentSimilarity : this.state.enableDocumentSimilarity,
            documentSimilarityThreshold: Api.defined(data.documentSimilarityThreshold) ? data.documentSimilarityThreshold : this.state.documentSimilarityThreshold,
            isExternal: Api.defined(data.isExternal) ? data.isExternal : this.state.isExternal,
        };
    }

    setError(title, error_msg) {
        if (this.props.onError) {
            this.props.onError(title, error_msg);
        }
    }

    change_callback(data) {
        if (Api.defined(data.internalCrawler)) {
            if (data.internalCrawler && this.state.nodeId === external_node_id) {
                data.nodeId = 0;
            } else {
                data.nodeId = this.state.nodeId;
            }
        }
        this.setState(data);
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(data));
        }
    }

    testCrawler() {
        const name = this.state.name;
        if (this.props.testCrawler) {
            this.props.testCrawler(this.state.sourceId, () => {
                this.setState({
                    message_callback: () => {
                        this.setState({message_title: '', message: ''})
                    },
                    message_title: 'Crawler Test',
                    message: 'Success!  crawler "' + name + '" can communicate with its intended end-point.'
                });
            }, (errStr) => {
                console.error(errStr);
                this.setError("Error Testing Crawler", errStr);
            });
        }
    }

    canHaveEdgeDevice() {
        const crawlerType = this.state.crawlerType;
        return crawlerType !== 'exchange365' && crawlerType !== 'wordpress' &&
               crawlerType !== 'gdrive' && crawlerType !== 'onedrive' && crawlerType !== 'sharepoint365' &&
               crawlerType !== 'servicenow';
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
                               title={this.state.message_title}/>

                <div className="crawler-page">

                    <div className="type-select-box">
                        <select className="form-select customWidth" onChange={(event) => {
                            this.change_callback({crawlerType: event.target.value})
                        }}
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
                        <span className="label-processing"
                              title="Select what kind of processing you want done to these files">processing level:</span>
                        <span className="processing-list">
                            <div className="form-check form-check-inline"
                                 title="extract all text and metadata from documents">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("CONVERT")}
                                       id="inlineRadio1" value="CONVERT"
                                       checked={this.state.processingLevel === "CONVERT"}/>
                                <label className="form-check-label" htmlFor="inlineRadio1">convert to text</label>
                            </div>
                            <div className="form-check form-check-inline"
                                 title="process and analyze the metadata and text of all documents">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("PARSE")}
                                       id="inlineRadio2" value="PARSE"
                                       checked={this.state.processingLevel === "PARSE"}/>
                                <label className="form-check-label" htmlFor="inlineRadio2">process text</label>
                            </div>
                            <div className="form-check form-check-inline"
                                 title="make the documents searchable by creating inverted indexes">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                                       onChange={() => this.setProcessingLevelFromMark("INDEX")}
                                       id="inlineRadio3" value="INDEX"
                                       checked={this.state.processingLevel === "INDEX"}/>
                                <label className="form-check-label" htmlFor="inlineRadio3">create indexes</label>
                            </div>
                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <input type="text" className="form-control"
                                   placeholder="Crawler Name"
                                   autoFocus
                                   value={this.state.name}
                                   onChange={(event) => {
                                       this.change_callback({name: event.target.value})
                                   }}
                            />
                        </span>
                        <span className="right-column">
                            <span className="label-right">files per second throttle</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="files per second throttle"
                                       value={this.state.filesPerSecond}
                                       onChange={(event) => {
                                           this.change_callback({filesPerSecond: event.target.value})
                                       }}
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
                                       onChange={(event) => {
                                           this.change_callback({maxItems: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            <span className="label-right">maximum number of QA</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="Maximum number of QA entries (0 for no limits)"
                                       value={this.state.maxQNAItems}
                                       onChange={(event) => {
                                           this.change_callback({maxQNAItems: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                    </div>


                    <div className="form-group">
                        {(this.state.internalCrawler || this.state.crawlerType !== 'restfull') &&
                            <span className="left-column">
                            <span className="label-right">k8s pod id (e.g. 0, 1, 2)</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="k8s pod id (0 for k8s clusters with only one pod)"
                                       value={this.state.nodeId === external_node_id ? 0 : this.state.nodeId}
                                       onChange={(event) => {
                                           this.change_callback({nodeId: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                        }

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
                            {(this.state.crawlerType === 'restfull') &&
                                <div title="Restful crawlers can be internal to the platform.">
                                    <input type="checkbox"
                                           checked={this.state.internalCrawler && this.state.crawlerType === 'restfull'}
                                           onChange={(event) => {
                                               this.change_callback({internalCrawler: event.target.checked && this.state.crawlerType === 'restfull'});
                                           }}
                                           value="internal crawler?"
                                    />
                                    <span className="label-left">internal crawler?</span>
                                </div>
                            }
                        </span>
                    </div>

                    <br/>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="If checked, SimSage perform similarity calculations on all items in this source against all other enabled sources and itself.">
                                <input type="checkbox"
                                       checked={this.state.enableDocumentSimilarity}
                                       onChange={(event) => {
                                           this.change_callback({enableDocumentSimilarity: event.target.checked});
                                       }}
                                       value="Enable similarity checking for documents?"
                                />
                                <span className="label-left">enable similarity checking for documents?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <span className="label-right">similarity threshold</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="a number betwene 0.75 and 1.0"
                                       value={this.state.documentSimilarityThreshold}
                                       onChange={(event) => {
                                           this.change_callback({documentSimilarityThreshold: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                    </div>

                    <br/>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                                <input type="checkbox"
                                       checked={this.state.deleteFiles && this.state.crawlerType !== 'rss'}
                                       disabled={this.state.crawlerType === 'rss'}
                                       onChange={(event) => {
                                           this.change_callback({deleteFiles: event.target.checked});
                                       }}
                                       value="delete files?"
                                />
                                <span className="label-left">remove un-seen files?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <div style={{float: 'left'}}
                                 title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">
                                <input type="checkbox"
                                       checked={this.state.allowAnonymous}
                                       onChange={(event) => {
                                           this.change_callback({allowAnonymous: event.target.checked});
                                       }}
                                       value="allow anonymous access to these files?"
                                />
                                <span className="label-left">allow anonymous access to these files?</span>
                            </div>
                        </span>
                    </div>


                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                                <input type="checkbox"
                                       checked={this.state.enablePreview && (this.state.processingLevel === "INDEX" || this.state.processingLevel === "PARSE")}
                                       disabled={this.state.processingLevel !== "INDEX" && this.state.processingLevel !== "PARSE"}
                                       onChange={(event) => {
                                           this.change_callback({enablePreview: event.target.checked});
                                       }}
                                       value="enable document image previews?"
                                />
                                <span className="label-left">enable document image previews?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <div style={{float: 'left'}} title="Use our default built-in relationships">
                                <input type="checkbox"
                                       checked={this.state.useDefaultRelationships}
                                       onChange={(event) => {
                                           this.change_callback({useDefaultRelationships: event.target.checked});
                                       }}
                                       value="use default built-in relationships?"
                                />
                                <span className="label-left">use default built-in relationships?</span>
                            </div>
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="If checked, SimSage will auto-optimize the indexes after this source finishes crawling.">
                                <input type="checkbox"
                                       checked={this.state.autoOptimize}
                                       onChange={(event) => {
                                           this.change_callback({autoOptimize: event.target.checked});
                                       }}
                                       value="Auto-optimize this source after it finishes crawling?"
                                />
                                <span className="label-left">auto optimize after crawling?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <div style={{float: 'left'}}
                                 title="If checked, SimSage will store the document binaries locally (default true).">
                                <input type="checkbox"
                                       checked={this.state.storeBinary}
                                       onChange={(event) => {
                                           this.change_callback({storeBinary: event.target.checked});
                                       }}
                                       value="Store the binaries of each document inside the SimSage platform?"
                                />
                                <span className="label-left">store the binaries of each document?</span>
                            </div>
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="If checked, SimSage will keep older versions of the document, unchecked it will only keep the latest">
                                <input type="checkbox"
                                       checked={this.state.versioned}
                                       onChange={(event) => {
                                           this.change_callback({versioned: event.target.checked});
                                       }}
                                       value="Store older versions of the document?"
                                />
                                <span className="label-left">store older versions of the document?</span>
                            </div>
                        </span>
                        <span className="right-column">
                            <div style={{float: 'left'}}
                                 title="If checked (default) we write all index-data direct to Cassandra">
                                <input type="checkbox"
                                       checked={this.state.writeToCassandra}
                                       onChange={(event) => {
                                           this.change_callback({writeToCassandra: event.target.checked});
                                       }}
                                       value="write indexes direct to Cassandra?"
                                />
                                <span className="label-left">write indexes direct to Cassandra?</span>
                            </div>
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="is this a source that needs an external crawler to operate?">
                                <input type="checkbox"
                                       checked={this.state.isExternal}
                                       onChange={(event) => {
                                           this.change_callback({isExternal: event.target.checked});
                                       }}
                                       value="external source?"
                                />
                                <span className="label-left">external source?</span>
                            </div>
                        </span>
                        <span className="right-column">
                        </span>
                    </div>

                    <br/>

                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right">number of fragments</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="number of fragments per search result"
                                       value={this.state.numFragments}
                                       onChange={(event) => {
                                           this.change_callback({numFragments: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            <span className="label-right">Q&A threshold</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder={"Q&A threshold (" + default_qna_threshold + " default)"}
                                       value={this.state.qaMatchStrength}
                                       onChange={(event) => {
                                           this.change_callback({qaMatchStrength: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                    </div>

                    <div className="form-group">
                        <span className="left-column">
                            <span className="label-right">error threshold</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="the maximum number of errors allowed before failing"
                                       value={this.state.errorThreshold}
                                       onChange={(event) => {
                                           this.change_callback({errorThreshold: event.target.value})
                                       }}
                                />
                            </span>
                        </span>
                        <span className="right-column">
                            <span className="label-right">number of search results</span>
                            <span className="number-textbox">
                                <input type="text" className="form-control"
                                       placeholder="number of search results"
                                       value={this.state.numResults}
                                       onChange={(event) => {
                                           this.change_callback({numResults: event.target.value})
                                       }}
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
                                <select className="form-select"
                                        onChange={(event) => this.change_callback({edgeDeviceId: event.target.value})}
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
                            <div>
                                <button className="btn btn-primary btn-block"
                                        onClick={() => this.testCrawler()}>Test Connection
                                </button>
                            </div>
                        }
                    </div>


                </div>
            </div>
        );
    }
}

export default CrawlerGeneral;
