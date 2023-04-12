import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

export default function GeneralForm(props) {


    // a few defaults
    // marker for an external node
    const default_error_threshold = 10;
    const default_num_results = 5;
    const default_num_fragments = 3;
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


    const selected_source = props.source;
    const selected_source_type = selected_source.crawlerType
    const internal_crawler = selected_source.internalCrawler;


    //methods
    function canHaveEdgeDevice() {
        const crawler_type = props.getValues("crawlerType");
        return !['exchange365', 'wordpress', 'gdrive', 'onedrive', 'sharepoint365'].includes(crawler_type)
    }


    //todo:: filteredEdgeDevices
    function filteredEdgeDevices() {
        let list = [{"key": "none", "value": "n/a"}];
        // if (props.edge_device_list) {
        //     for (let edge_device of this.props.edge_device_list) {
        //         if (edge_device.organisationId === this.state.organisation_id && edge_device.edgeId) {
        //             list.push({"key": edge_device.edgeId, "value": edge_device.name});
        //         }
        //     }
        // }
        return list;
    }


    function handleTestCrawler() {
        const name = selected_source.name;
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

    console.log("crawlerType", selected_source.crawlerType)
    //Validation Data


    return (
        <div className="crawler-page w-100 tab-content px-5 py-4 overflow-auto"  style={{maxHeight: "600px", minHeight: "400px"}}>

            {/* crawlerType */}
            <div className="control-row">
                <span className="label-left">Crawler type</span>

                <select
                    className="form-select w-50"  {...props.register("crawlerType", {disabled: (selected_source && selected_source.sourceId !== '0')})}>
                    {
                        crawler_list.map((value) => {
                            return (<option key={value.key} value={value.key}>{value.value}</option>)
                        })
                    }
                </select>

            </div>

            {/* processingLevel */}
            <div className="control-row my-lg-2">
                <span className="label-left">processing level</span>
                <div className={"flex space-x-3"}>
                    {[
                        // {label: "discovery", value: "FILES"},
                        // {label: "GDPR", value: "GDPR"},
                        // {label: "search", value: "SEARCH"},
                        // {label: "NLU", value: "NLU"},
                        {value: "CONVERT", label: "convert to text"},
                        {value: "PARSE", label: "process text"},
                        {value: "INDEX", label: "create indexes"},


                    ].map((item, i) => {
                        return <label key={i} className={"mx-1"}><input {...props.register("processingLevel")}
                                                                        type="radio"
                                                                        value={item.value}/> {item.label} &nbsp; &nbsp;
                        </label>
                    })
                    }
                </div>
            </div>

            {/*  */}
            <div className="form-group my-lg-2">
                <span className="label-left">Crawler name</span>
                <input className={"w-50"} {...props.register("name", {required: true})} disabled={false}
                       placeholder={"Crawler Name"}/>
                {props.errors.name && <span className=""> Name is required <br/></span>}
            </div>

            {/*  */}

            <div className="my-lg-2">
                <div className="form-group">
                    <div className="left-column">

                        <span className="label-left">Files per second throttle</span>
                        <input {...props.register("filesPerSecond", {required: true})} disabled={false}/>
                        {props.errors.filesPerSecond && <span className="">This field is required <br/></span>}
                    </div>

                    <div className="right-column">
                        <span className="label-left">Maximum number of files</span>
                        <input {...props.register("maxItems", {required: true})} disabled={false}/>
                        {props.errors.maxItems && <span className="">This field is required <br/></span>}
                    </div>
                </div>


                <div className="form-group">
                    {/*  */}
                    <div className="left-column">
                        <span className="label-left">maximum number of QA</span>
                        <input {...props.register("maxQNAItems", {required: true})} disabled={false}/>
                        {props.errors.maxQNAItems && <span className="">This field is required <br/></span>}
                    </div>


                    {/*    */}
                    {(internal_crawler || selected_source_type !== 'restfull') &&
                        <div className="right-column">
                            <span className="label-left">k8s pod id (e.g. 0, 1, 2)</span>
                            <input {...props.register("nodeId", {required: true})}
                                   placeholder="k8s pod id (e.g. 0, 1, 2)"/>
                        </div>
                    }
                </div>

                <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="If checked, SimSage perform similarity calculations on all items in this source against all other enabled sources and itself.">
                                <input type="checkbox" {...props.register("enableDocumentSimilarity")} />
                                <span className="label-left">enable similarity checking for documents?</span>
                            </div>
                        </span>
                    <span className="right-column">
                            <span className="label-right">similarity threshold</span>
                            <span className="number-textbox">
                                <input
                                    type="text" {...props.register("documentSimilarityThreshold")} />

                            </span>
                        </span>
                </div>


                <div className="form-group">
                    {/*  */}
                    {(selected_source_type === 'database' || selected_source_type === 'restfull') &&
                        <div className="left-column"
                             title="Restful and DB crawlers have optional custom-rendering flags.">
                            <input type="checkbox" {...props.register("customRender")}  />
                            <span className="label-left">custom render?</span>

                        </div>
                    }

                    {/*  */}
                    {(selected_source_type === 'restfull') &&
                        <div className="right-column" title="Restful crawlers can be internal to the platform.">
                            <input type="checkbox" {...props.register("internalCrawler")}  />
                            <span className="label-left">internal crawler?</span>

                        </div>
                    }
                </div>
            </div>

            <div className="my-lg-4">
                <div className="form-group">
                    <div className="left-column"
                         title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                        <input type="checkbox" {...props.register("deleteFiles")}  />
                        <span className="label-left">remove un-seen files?</span>
                    </div>

                    <div className="right-column"
                         title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">

                        <input
                            type="checkbox"
                            {...props.register(
                                "allowAnonymous",
                                {disabled: ['web', 'rss', 'googlesite'].includes(props.getValues("crawlerType"))}
                            )} />
                        <span className="label-left">allow anonymous access to these files?</span>
                    </div>
                </div>


                <div className="form-group">
                    <div className="left-column"
                         title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                        <input type="checkbox" {...props.register("enablePreview")} />
                        {/*checked={this.state.enablePreview && (this.state.processingLevel === "SEARCH" || this.state.processingLevel === "NLU")}*/}
                        {/*disabled={this.state.processingLevel !== "SEARCH" && this.state.processingLevel !== "NLU"}*/}
                        <span className="label-left">enable document image previews?</span>
                    </div>

                    <div className="right-column" title="Use our default built-in relationships">
                        <input type="checkbox" {...props.register("useDefaultRelationships")} />
                        <span className="label-left">use default built-in relationships?</span>
                    </div>
                </div>

                <div className="form-group">

                    <div className="left-column"
                         title="If checked, SimSage will auto-optimize the indexes after this source finishes crawling.">
                        <input type="checkbox" {...props.register("autoOptimize")} />
                        <span className="label-left">auto optimize after crawling?</span>
                    </div>

                    <span className="right-column">
                            <div
                                 title="If checked, SimSage will store the document binaries locally (default true).">
                                <input type="checkbox" {...props.register("storeBinary")}
                                       value="Store the binaries of each document inside the SimSage platform?"/>
                                <span className="label-left">store the binaries of each document?</span>
                            </div>
                        </span>
                </div>

                <div className="form-group">
                        <span className="left-column">
                            <div
                                 title="If checked, SimSage will keep older versions of the document, unchecked it will only keep the latest">
                                <input type="checkbox" {...props.register("versioned")}
                                       value="Store older versions of the document?"/>
                                <span className="label-left">store older versions of the document?</span>
                            </div>
                        </span>
                    <span className="right-column">
                            <div
                                 title="If checked (default) we write all index-data direct to Cassandra">
                                <input type="checkbox" {...props.register("writeToCassandra")}
                                       value={"write indexes direct to Cassandra?"}/>
                                <span className="label-left">write indexes direct to Cassandra?</span>
                            </div>
                        </span>
                </div>

                <div className="form-group">
                        <span className="left-column">
                            <div style={{float: 'left'}}
                                 title="is this a source that needs an external crawler to operate?">
                                <input type="checkbox" {...props.register("isExternal")} value={"external source?"}/>
                                <span className="label-left">external source?</span>
                            </div>
                        </span>
                    <span className="right-column">
                        </span>
                </div>


                <div className="my-lg-4">
                    <div className="form-group">
                        <div className="left-column">
                            <span className="label-left">number of fragments</span>
                            <input {...props.register("numFragments", {required: true})}
                                   placeholder="number of fragments per search result"/>
                        </div>

                        <div className="right-column">
                            <span className="label-left">Q&A threshold</span>
                            <input {...props.register("qaMatchStrength", {required: true})}
                                   placeholder={"Q&A threshold (" + default_qna_threshold + " default)"}/>
                        </div>
                    </div>


                    <div className="form-group">
                        <div className="left-column">
                            <span className="label-left">error threshold</span>
                            <input {...props.register("errorThreshold", {required: true})}
                                   placeholder="the maximum number of errors allowed before failing"/>
                        </div>

                        <div className="right-column">
                            <span className="label-left">number of search results</span>
                            <input {...props.register("numResults", {required: true})}
                                   placeholder="number of search results"/>
                        </div>
                    </div>
                </div>


                {canHaveEdgeDevice() &&
                    <div className="form-group ">
                        <div className="left-column">
                            <span className="label-left"
                                  title="you can connect this source to a SimSage Edge device if you have one.  Select it here.">
                                Edge device
                            </span>
                            <span className="select-box-after-label">
                                <select className="form-select" {...props.register("edgeDeviceId", {
                                    required: true,
                                    disabled: props.getValues("sourceId") !== 0
                                })} >
                                    {filteredEdgeDevices().map((value) => {
                                            return (<option key={value.key} value={value.key}>{value.value}</option>)
                                        }
                                    )}
                                </select>
                            </span>
                        </div>
                    </div>
                }


                <div className="form-group">
                    {selected_source && selected_source.id > 0 && selected_source_type !== 'nfs' &&
                        selected_source_type !== 'database' && selected_source_type !== 'restfull' &&
                        <div>
                            <button className="btn btn-primary btn-block"
                                    onClick={() => handleTestCrawler()}>Test Connection
                            </button>
                        </div>
                    }


                </div>

            </div>
        </div>
                );

        }