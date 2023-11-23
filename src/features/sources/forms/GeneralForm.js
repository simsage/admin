import React from "react";
// import {useSelector} from "react-redux";

export default function GeneralForm(props) {


    // a few defaults
    // marker for an external node
    // const default_error_threshold = 10;
    // const default_num_results = 5;
    // const default_num_fragments = 3;
    const default_qna_threshold = 0.8125;

    const crawler_list = [
        {"key": "none", "value": "Select Crawler Type..."},
        {"key": "box", "value": "Box crawler"},
        {"key": "confluence", "value": "Confluence crawler"},
        {"key": "database", "value": "Database crawler"},

        {"key": "discourse", "value": "Discourse crawler"},
        {"key": "dropbox", "value": "Dropbox crawler"},

        {"key": "exchange365", "value": "Exchange 365 crawler"},
        {"key": "external", "value": "External crawler"},

        {"key": "file", "value": "Microsoft FileShare crawler"},
        {"key": "gdrive", "value": "Google-drive crawler"},
        {"key": "imanage", "value": "iManage crawler"},
        {"key": "jira", "value": "Jira crawler"},

        {"key": "localfile", "value": "Local file crawler"},
        {"key": "onedrive", "value": "One-drive crawler"},

        {"key": "restfull", "value": "REST-full crawler"},
        {"key": "rss", "value": "RSS crawler"},

        {"key": "servicenow", "value": "Service-now crawler"},
        {"key": "sharepoint365", "value": "Sharepoint 365 crawler"},
        {"key": "web", "value": "Web crawler"},
        {"key": "search", "value": "Search crawler"},
    ];


    const selected_source = props.source;
    const selected_source_type = props.crawler_type
    const internal_crawler = selected_source.internalCrawler;


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
                this.setError("Error Testing Crawler", errStr);
            });
        }
    }


    return (
        <div className="w-100 tab-content px-5 pt-4 pb-5 overflow-auto"  style={{maxHeight: "600px", minHeight: "400px"}}>
            <div className="row mb-4">
                {/* crawlerType */}
                <div className="control-row col-3">
                    <label className="label-left small">Crawler Type</label>
                    <select
                        className="form-select"  {...props.register("crawlerType", {disabled: (selected_source && selected_source.sourceId !== '0')})}>
                        {
                            crawler_list.map((value) => {
                                return (<option key={value.key} value={value.key}>{value.value}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="control-row col-3">
                    <label className="label-left small">Crawler Name</label>
                    <input className="form-control" {...props.register("name", {required: true})} disabled={false}
                        placeholder={"Crawler Name..."}/>
                    {props.errors.name && <span className="text-danger small fw-light fst-italic"> Name is required <br/></span>}
                </div>
            </div>


            <div className="row mb-4 pt-3 border-top">
                <div className="col-6">
                    <label className="label-left small">Processing Level</label>
                    <div className="d-flex btn-group" role="group" aria-label="Basic radio toggle button group">
                        {[
                            {value: "CONVERT", label: "Document Inventory", help: "Step 1: Convert the documents to text and collect their basic information."},
                            {value: "PARSE", label: "Document Analysis", help: "Step 2: Apply fully processing and collect similarities and other statistics for each document."},
                            {value: "INDEX", label: "Document Finding", help: "Step 3: Make the information in the documents findable."},
                        ].map((item, i) => {
                            return <label key={i} title={item.help} style={{borderColor: "#ced4da"}} className="w-100 px-3 py-2 btn btn-sm" ><input className="form-check-input me-1" {...props.register("processingLevel")}
                                        type="radio"
                                        value={item.value}/> {item.label}
                            </label>
                        })
                        }
                    </div>
                </div>
            </div>

            
            <div className="row mb-4 pt-3 border-top">
                <div className="col-2">
                    <div className="form-group">
                        <label className="label-left small">Files per second throttle</label>
                        <input className="form-control" {...props.register("filesPerSecond", {required: true})} disabled={false}/>
                        {props.errors.filesPerSecond && <span className="text-danger small fw-light fst-italic">This field is required <br/></span>}
                    </div>
                </div>
                <div className="col-2">
                    <div className="form-group">
                            <label className="label-left small">Maximum number of files</label>
                            <input className="form-control" {...props.register("maxItems", {required: true})} disabled={false}/>
                            {props.errors.maxItems && <span className="text-danger small fw-light fst-italic">This field is required <br/></span>}
                    </div>
                </div>
                <div className="col-2">
                    <div className="form-group">
                        <label className="label-left small">maximum number of QA</label>
                        <input className="form-control" {...props.register("maxQNAItems", {required: true})} disabled={false}/>
                        {props.errors.maxQNAItems && <span className="text-danger small fw-light fst-italic">This field is required <br/></span>}
                    </div>
                </div>
                <div className="col-2">
                    {/*    */}
                    {(internal_crawler || selected_source_type !== 'restfull') &&
                        <div className="form-group">
                            <label className="label-left small">k8s pod id (e.g. 0, 1, 2)</label>
                            <input className="form-control" {...props.register("nodeId", {required: true})}
                                   placeholder="k8s pod id (e.g. 0, 1, 2)"/>
                        </div>
                    }
                </div>
            </div>

            <div className="row mb-4 pt-3 border-top"> 
                <div className="col-4">
                    <div className="form-check form-switch" title="If checked, SimSage perform similarity calculations on all items in this source against all other enabled sources and itself.">
                        <input className="form-check-input" type="checkbox" {...props.register("enableDocumentSimilarity")} />
                        <label className="form-check-label small">Enable similarity checking for documents</label>
                    </div>
                </div>
                <div className="col-2">
                    <label className="small">Similarity Threshold</label>
                    <input className="form-control"
                        type="text" {...props.register("documentSimilarityThreshold")} />

                </div>
            </div>

            <div className="row mb-3 pt-3 border-top">
                <div className="col-4">
                    <div className="form-check form-switch" title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                        <input className="form-check-input" type="checkbox" {...props.register("deleteFiles")}/>
                        <label className="form-check-label small">Remove Un-seen Files</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">
                        <input className="form-check-input" type="checkbox" {...props.register("allowAnonymous")} />
                        <label className="form-check-label small">Allow anonymous access to these files</label>
                    </div>
                </div>
                <div className="col-4">  
                    <div className="form-check form-switch" title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                        <input className="form-check-input" type="checkbox" {...props.register("enablePreview")} />
                        {/*checked={this.state.enablePreview && (this.state.processingLevel === "SEARCH" || this.state.processingLevel === "NLU")}*/}
                        {/*disabled={this.state.processingLevel !== "SEARCH" && this.state.processingLevel !== "NLU"}*/}
                        <label className="form-check-label small">Enable document image previews</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="Use our default built-in relationships">
                        <input className="form-check-input" type="checkbox" {...props.register("useDefaultRelationships")} />
                        <label className="form-check-label small">Use default built-in relationships</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="If checked, SimSage will auto-optimize the indexes after this source finishes crawling.">
                        <input className="form-check-input" type="checkbox" {...props.register("autoOptimize")} />
                        <span className="form-check-label small">Auto optimize after crawling</span>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="If checked, SimSage will store the document binaries locally (default true).">
                        <input className="form-check-input" type="checkbox" {...props.register("storeBinary")}
                               title="Store the binaries of each document inside the SimSage platform?"/>
                        <label className="form-check-label small">Store the binaries of each document</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="If checked, SimSage will keep older versions of the document, unchecked it will only keep the latest">
                        <input className="form-check-input" type="checkbox" {...props.register("versioned")}
                            title="Store older versions of the document?"/>
                        <label className="form-check-label small">Store older versions of the Document</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="Process all documents using OCR where needed (slow)">
                        <input className="form-check-input" type="checkbox" {...props.register("useOCR")}
                               title={"use OCR on all documents?"}/>
                        <label className="form-check-label small">use optical-character-recognition (OCR)</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="use speech-to-text for this source">
                        <input className="form-check-input" type="checkbox" {...props.register("useSTT")} />
                        <label className="form-check-label small">use speech-to-text (videos, audio transcripts)</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="is this a source that needs an external crawler to operate?">
                        <input className="form-check-input" type="checkbox" {...props.register("isExternal")} />
                        <label className="form-check-label small">External source</label>
                    </div>
                </div>
                {(selected_source_type === 'database' || selected_source_type === 'restfull') &&
                    <div className="col-4">
                        <div className="form-check form-switch"
                             title="Restful and DB crawlers have optional custom-rendering flags.">
                            <input className="form-check-input" type="checkbox" {...props.register("customRender")}  />
                            <label className="form-check-label small">Custom render</label>
                        </div>

                    </div>
                }
                {(selected_source_type === 'restfull') &&
                    <div className="col-4">
                        <div className="form-check form-switch" title="Restful crawlers can be internal to the platform.">
                            <input className="form-check-input" type="checkbox" {...props.register("internalCrawler")}  />
                            <label className="form-check-label small">Internal crawler</label>

                        </div>
                    </div>
                }
            </div>

            <div className="row mb-4 pt-3 border-top">
                <div className="col-2">
                    <div className="left-column">
                        <label className="small">Number of fragments</label>
                        <input className="form-control" {...props.register("numFragments", {required: true})}
                            placeholder="number of fragments per search result"/>
                    </div>
                </div>

                <div className="col-2">
                    <div className="right-column">
                        <label className="small">Q&A threshold</label>
                        <input className="form-control" {...props.register("qaMatchStrength", {required: true})}
                            placeholder={"Q&A threshold (" + default_qna_threshold + " default)"}/>
                    </div>
                </div>


                <div className="col-2">
                    <div className="left-column">
                        <label className="small">Error threshold</label>
                        <input className="form-control" {...props.register("errorThreshold", {required: true})}
                            placeholder="the maximum number of errors allowed before failing"/>
                    </div>
                </div>
                <div className="col-2">
                    <div className="right-column">
                        <label className="small">Number of search results</label>
                        <input className="form-control" {...props.register("numResults", {required: true})}
                            placeholder="number of search results"/>
                    </div>
                </div>
            </div>


            <div className="form-group">
                {selected_source && selected_source.id > 0 && selected_source_type !== 'localfile' &&
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