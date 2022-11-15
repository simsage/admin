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
        {"key": "file", "value": "file crawler"},
        {"key": "web", "value": "web crawler"},
        {"key": "exchange365", "value": "exchange 365 crawler"},
        {"key": "onedrive", "value": "one-drive crawler"},
        {"key": "sharepoint365", "value": "sharepoint 365 crawler"},
        {"key": "box", "value": "box crawler"},
        {"key": "imanage", "value": "iManage crawler"},
        {"key": "dropbox", "value": "dropbox crawler"},
        {"key": "wordpress", "value": "WordPress external crawler"},
        {"key": "gdrive", "value": "Google-drive crawler"},
        {"key": "nfs", "value": "nfs external crawler"},
        {"key": "database", "value": "database crawler"},
        {"key": "restfull", "value": "REST-full crawler"},
        {"key": "rss", "value": "RSS crawler"},
        {"key": "external", "value": "External crawler"},
    ];


    const selected_source = props.source;
    const selected_source_type = selected_source.crawlerType
    const internal_crawler = useState(selected_source.internalCrawler);


    //methods
    function canHaveEdgeDevice() {
        const crawler_type = props.getValues("crawlerType");
        return !['exchange365','wordpress', 'gdrive', 'onedrive', 'sharepoint365'].includes(crawler_type)
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


    //Validation Data


    return (
        <div className="crawler-page w-100">

            {/* crawlerType */}
            <div className="control-row">
                <span className="label-3">Crawler type</span>

                <select className="form-select w-50"  {...props.register("crawlerType",{disabled:(selected_source && selected_source.sourceId !== '0')})}>
                    {
                        crawler_list.map((value) => {
                            return (<option key={value.key} value={value.key}>{value.value}</option>)
                        })
                    }
                </select>

            </div>

            {/* processingLevel */}
            <div className="control-row my-lg-2">
                <span className="label-3">Processing level</span>
                <div className={"flex space-x-4"}>
                    {[{label: "discovery", value: "FILES"},
                        {label: "GDPR", value: "GDPR"},
                        {label: "search", value: "SEARCH"},
                        {label: "NLU", value: "NLU"},
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
                <span className="label-3">Crawler name</span>
                <input className={"w-50"} {...props.register("name", {required: true})} disabled={false}
                       placeholder={"Crawler Name"}/>
                {props.errors.name && <span className=""> Name is required <br/></span>}
            </div>

            {/*  */}

            <div className="my-lg-2">
                <div className="form-group">
                    <div className="left-column">

                        <span className="label-3">Files per second throttle</span>
                        <input {...props.register("filesPerSecond", {required: true})} disabled={false}/>
                        {props.errors.name && <span className="">This field is required <br/></span>}
                    </div>

                    <div className="right-column">
                        <span className="label-3">Maximum number of files</span>
                        <input {...props.register("maxItems", {required: true})} disabled={false}/>
                        {props.errors.name && <span className="">This field is required <br/></span>}
                    </div>
                </div>


                <div className="form-group">
                    {/*  */}
                    <div className="left-column">
                        <span className="label-3">maximum number of QA</span>
                        <input {...props.register("maxQNAItems", {required: true})} disabled={false}/>
                        {props.errors.name && <span className="">This field is required <br/></span>}
                    </div>


                    {/*    */}
                    {(internal_crawler || selected_source_type !== 'restfull') &&
                        <div className="right-column">
                            <span className="label-3">k8s pod id (e.g. 0, 1, 2)</span>
                            <input {...props.register("nodeId", {required: true})}
                                   placeholder="k8s pod id (e.g. 0, 1, 2)"/>
                        </div>
                    }
                </div>


                <div className="form-group">
                    {/*  */}
                    {(selected_source_type === 'database' || selected_source_type === 'restfull') &&
                        <div className="left-column"
                             title="Restful and DB crawlers have optional custom-rendering flags.">
                            <input type="checkbox" {...props.register("customRender")}  />
                            <span className="label-3">custom render?</span>

                        </div>
                    }

                    {/*  */}
                    {(selected_source_type === 'restfull') &&
                        <div className="right-column" title="Restful crawlers can be internal to the platform.">
                            <input type="checkbox" {...props.register("internalCrawler")}  />
                            <span className="label-3">internal crawler?</span>

                        </div>
                    }
                </div>
            </div>

            <div className="my-lg-4">
                <div className="form-group">
                    <div className="left-column"
                         title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                        <input type="checkbox" {...props.register("deleteFiles")}  />
                        <span className="label-3">remove un-seen files?</span>
                    </div>

                    <div className="right-column"
                         title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">

                        <input
                            type="checkbox"
                            {...props.register(
                                "allowAnonymous",
                                {disabled: ['web','rss','googlesite'].includes(props.getValues("crawlerType"))}
                            )} />
                        <span className="label-3">allow anonymous access to these files?</span>
                    </div>
                </div>


                <div className="form-group">
                    <div className="left-column"
                         title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                        <input type="checkbox" {...props.register("enablePreview")} />
                        {/*checked={this.state.enablePreview && (this.state.processingLevel === "SEARCH" || this.state.processingLevel === "NLU")}*/}
                        {/*disabled={this.state.processingLevel !== "SEARCH" && this.state.processingLevel !== "NLU"}*/}
                        <span className="label-3">enable document image previews?</span>
                    </div>

                    <div className="right-column" title="Use our default built-in relationships">
                        <input type="checkbox" {...props.register("useDefaultRelationships")} />
                        <span className="label-3">use default built-in relationships?</span>
                    </div>
                </div>

                <div className="form-group">
                    <div className="left-column"
                         title="If checked, SimSage will auto-optimize the indexes after this source finishes crawling.">
                        <input type="checkbox" {...props.register("autoOptimize")} />
                        <span className="label-3">Auto-optimize this source after it finishes crawling?</span>
                    </div>

                    <div className="right-column" title="">
                    </div>
                </div>

            </div>


            <div className="my-lg-4">
                <div className="form-group">
                    <div className="left-column">
                        <span className="label-3">number of fragments</span>
                        <input {...props.register("numFragments", {required: true})}
                               placeholder="number of fragments per search result"/>
                    </div>

                    <div className="right-column">
                        <span className="label-3">Q&A threshold</span>
                        <input {...props.register("qaMatchStrength", {required: true})}
                               placeholder={"Q&A threshold (" + default_qna_threshold + " default)"}/>
                    </div>
                </div>


                <div className="form-group">
                    <div className="left-column">
                        <span className="label-3">error threshold</span>
                        <input {...props.register("errorThreshold", {required: true})}
                               placeholder="the maximum number of errors allowed before failing"/>
                    </div>

                    <div className="right-column">
                        <span className="label-3">number of search results</span>
                        <input {...props.register("numResults", {required: true})}
                               placeholder="number of search results"/>
                    </div>
                </div>
            </div>


            {canHaveEdgeDevice() &&
                <div className="form-group ">
                    <div className="left-column">
                            <span className="label-3"
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
    );
}