import CustomSelect from "../../../components/CustomSelect";
import {useSelector} from "react-redux";

export default function GeneralForm(props) {

    const crawler_list = [

        {"key": "aws", "value": "AWS Crawler"},
        {"key": "alfresco", "value": "Alfresco Crawler"},
        {"key": "box", "value": "Box Crawler"},

        {"key": "confluence", "value": "Confluence Crawler"},

        {"key": "database", "value": "Database Crawler"},
        {"key": "discourse", "value": "Discourse Crawler"},
        {"key": "dropbox", "value": "Dropbox Crawler"},

        {"key": "egnyte", "value": "Egnyte Crawler"},
        {"key": "sftp", "value": "SFTP Crawler"},
        {"key": "zendesk", "value": "Zendesk Crawler"},
        {"key": "slack", "value": "Slack Crawler"},
        {"key": "exchange365", "value": "Exchange 365 Crawler"},
        {"key": "external", "value": "External Crawler"},

        {"key": "file", "value": "Microsoft FileShare Crawler"},

        {"key": "gdrive", "value": "Google Drive Crawler"},
        {"key": "imanage", "value": "iManage Crawler"},
        {"key": "jira", "value": "Jira Crawler"},

        {"key": "localfile", "value": "Local file Crawler"},
        {"key": "onedrive", "value": "One Drive Crawler"},

        {"key": "restfull", "value": "REST-full Crawler"},
        {"key": "rss", "value": "RSS Crawler"},

        {"key": "servicenow", "value": "Service Now Crawler"},
        {"key": "sharepoint365", "value": "Sharepoint 365 Crawler"},
        {"key": "structured", "value": "Structured Data Crawler"},

        {"key": "web", "value": "Web Crawler"},
        {"key": "xml", "value": "Xml Crawler"},
    ];

    // SimSage system components enabled?
    const {stt_enabled, translate_enabled} = useSelector((state) => state.authReducer)

    function sortCrawlerList(c_list){
        const order_by_name_asc = (a, b) => {
            const nameA = a.value.toLowerCase(); // ignore upper and lowercase
            const nameB = b.value.toLowerCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        }

        //sort the list by asc
        c_list = c_list.sort(order_by_name_asc)

        //add "Select Crawler Type..." to the beginning of the list.
        c_list = [{"key": "none", "value": "Select Crawler Type..."}].concat(c_list)

        return c_list;
    }

    const selected_source = props.source;
    const selected_source_type = props.crawler_type;
    const l_form_data = props.form_data;
    const internal_crawler = selected_source.internalCrawler;

    function setCrawlerType(crawlerType) {
        props.setFormData({...l_form_data, crawlerType: crawlerType})
    }

    function handleTestCrawler() {
        const name = selected_source.name;
        if (this.props.testCrawler) {
            this.props.testCrawler(this.state.sourceId, () => {
                this.setState({
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
            {/***********************************-CRAWLER TYPE & NAME-***********************************/}
            <div className="row mb-4">
                <div className="control-row col-3">
                    <label className="label-left small">Crawler Type</label>
                    <CustomSelect
                        defaultValue={(l_form_data.crawlerType) ? l_form_data.crawlerType : "none"}
                        disabled={selected_source && selected_source.sourceId !== '0'}
                        onChange={(key) => setCrawlerType(key)}
                        options={sortCrawlerList(crawler_list)}
                    />
                </div>
                <div className="control-row col-3">
                    <label className="label-left small required">Crawler Name</label>
                    <input
                        className="form-control" {...props.register("name", {required: true})}
                        disabled={false}
                        placeholder={"Crawler Name..."}/>
                    {props.errors.name &&
                        <span className="text-danger small fw-light fst-italic"> Name is required <br/></span>
                    }
                </div>
            </div>

            {/***********************************-PROCESSING LEVEL-***********************************/}
            <div className="row mb-4 pt-3 border-top">
                <div className="col-6"
                     title={"Processing Level: select one of the below steps, from collecting documents, to collecting statistics, to making documents discoverable"}>
                    <label className="label-left small mb-2">Processing Level</label>
                    <div className="d-flex btn-group" role="group" aria-label="Basic radio toggle button group">
                        {[
                            {value: "CONVERT", label: "Collect Documents", help: "Convert documents. Collect basic document inventory information."},
                            {value: "PARSE", label: "Analyze Documents", help: "NLP processing.  Collect PII statistics for each document."},
                            {value: "INDEX", label: "Find Documents", help: "NLP processing with indexing.  Make information in documents findable."},
                        ].map((item, i) => {
                            return (
                                <label key={i} title={item.help} style={{borderColor: "#ced4da"}} className="w-100 px-3 py-2 btn btn-sm" >
                                    <input className="form-check-input me-1"
                                           {...props.register("processingLevel")}
                                           type="radio"
                                           value={item.value}
                                    />
                                    {item.label}
                                </label>
                            )
                        })
                        }
                    </div>
                </div>
            </div>

            {/***********************************-FILE OPTIONS-***********************************/}
            <div className="row mb-4 pt-3 border-top">
                <div className="col-2">
                    <div className="form-group">
                        <label className="label-left small">delay between uploads (ms)</label>
                        <input className="form-control" {...props.register("filesPerSecond", {required: true})}
                               title="delay in milliseconds between file uploads to SimSage, default 0 (no delay)"
                               inputMode="numeric"
                               type="number"
                               min="0"
                               max="100000"
                               step="1"
                               placeholder="ms between uploads"
                        />
                        {props.errors.filesPerSecond &&
                            <span className="text-danger small fw-light fst-italic">This field is required <br/></span>}
                    </div>
                </div>
                <div className="col-2">
                    <div className="form-group">
                        <label className="label-left small">Maximum number of files</label>
                        <input className="form-control" {...props.register("maxItems", {required: true})}
                               placeholder="(0 for no limit)"
                               inputMode="numeric"
                               type="number"
                               min="0"
                               max="10000000"
                               step="1"
                               title="if greater than 0, the maximum number of files to process, default 0"
                        />
                        {props.errors.maxItems &&
                            <span className="text-danger small fw-light fst-italic">This field is required <br/></span>}
                    </div>
                </div>
                <div className="col-2">
                    <div className="right-column">
                        <label className="small">Source Weight</label>
                        <input className="form-control" {...props.register("weight", {required: true})}
                               inputMode="numeric"
                               type="number"
                               min="0"
                               max="1"
                               step="0.1"
                               title="the weight of the source as a score multiplier, a value between 0.0 and 1.0.  Default 1"
                               placeholder={"weight (0.0 - 1.0)"}/>
                    </div>
                </div>
                <div className="col-2">
                    {(internal_crawler || selected_source_type !== 'restfull') &&
                        <div className="form-group">
                            <label className="label-left small">crawler pod id (0, 1, 2, ...)</label>
                            <input className="form-control"
                                   inputMode="numeric"
                                   type="number"
                                   min="0"
                                   max="100"
                                   step="1"
                                   {...props.register("nodeId", {required: true})}
                                   title="scalability - the pod's id to run in if more than one crawler is started. Default 0"
                                   placeholder="k8s pod id (e.g. 0, 1, 2)"/>
                        </div>
                    }
                </div>
                <div className="col-2">
                    <div className="left-column">
                        <label className="small">Error threshold</label>
                        <input className="form-control"
                               inputMode="numeric"
                               type="number"
                               min="0"
                               max="100"
                               step="1"
                               {...props.register("errorThreshold", {required: true})}
                               title="Enter the maximum number of errors allowed before failing"
                        />
                    </div>
                </div>
            </div>

            {/***********************************-SIMILARITY ENABLE & THRESHOLD-***********************************/}
            <div className="row mb-4 pt-3 border-top">
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="If checked, SimSage perform similarity calculations on all items in this source against all other enabled sources and itself.">
                    <input
                            className="form-check-input"
                            type="checkbox"
                            disabled={props.getValues("processingLevel") !== "INDEX"}
                            checked={props.getValues("processingLevel") === "INDEX" && props.getValues("enableDocumentSimilarity")}
                            {...props.register("enableDocumentSimilarity")}
                        />
                        <label className="form-check-label small">Enable similarity checking for documents</label>
                    </div>
                </div>
                <div className="col-2">
                    <label className="small">Similarity Threshold</label>
                    <div className="input-group">
                        <input
                            hidden={!props.getValues("enableDocumentSimilarity") || props.getValues("processingLevel") !== "INDEX"}
                            className="form-control"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            {...props.register("documentSimilarityThreshold")}
                        />
                        <span
                            hidden={!props.getValues("enableDocumentSimilarity") || props.getValues("processingLevel") !== "INDEX"}
                            className="input-group-text">%</span>
                    </div>
                </div>
            </div>

            {/***********************************-MISC CRAWLER OPTIONS-***********************************/}
            <div className="row mb-3 pt-3 border-top">
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                        <input className="form-check-input" type="checkbox" {...props.register("deleteFiles")}/>
                        <label className="form-check-label small">Remove Un-seen Files</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="Our default web-search and bot-interfaces require anonymous access to the data gathered by this source.  Check this box if you want anonymous users to view the data in it. (always enabled for web-sources).">
                        <input className="form-check-input" type="checkbox" {...props.register("allowAnonymous")} />
                        <label className="form-check-label small">Allow anonymous access to these files</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="Check this box if you preview images generated for each document.  Document search must be enabled for this to work.">
                        <input className="form-check-input" type="checkbox" {...props.register("enablePreview")} />
                        <label className="form-check-label small">Enable document image previews</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="Use our default built-in relationships">
                        <input className="form-check-input"
                               type="checkbox" {...props.register("useDefaultRelationships")} />
                        <label className="form-check-label small">Use default built-in relationships</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="If checked, SimSage will store the document binaries locally (default true).">
                        <input className="form-check-input" type="checkbox" {...props.register("storeBinary")}
                               title="Store the binaries of each document inside the SimSage platform?"/>
                        <label className="form-check-label small">Store the binaries of each document</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch" title="Process all documents using OCR where needed (slow)">
                        <input className="form-check-input" type="checkbox" {...props.register("useOCR")}
                               title={"use OCR on all documents?"}/>
                        <label className="form-check-label small">use optical-character-recognition (OCR)</label>
                    </div>
                </div>
                {stt_enabled &&
                <div className="col-4">
                    <div className="form-check form-switch" title="use speech-to-text for this source">
                        <input className="form-check-input" type="checkbox" {...props.register("useSTT")} />
                        <label className="form-check-label small">use speech-to-text (videos, audio transcripts)</label>
                    </div>
                </div>
                }
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="is this a source that needs an external crawler to operate?">
                        <input className="form-check-input" type="checkbox" {...props.register("isExternal")} />
                        <label className="form-check-label small">External source</label>
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="transmit external-crawler log entries to SimSage?">
                        <input className="form-check-input"
                               type="checkbox" {...props.register("transmitExternalLogs")} />
                        <label className="form-check-label small">Transmit external logs</label>
                    </div>
                </div>
                { translate_enabled &&
                <div className="col-4">
                    <div className="form-check form-switch"
                         title="translate foreign langauges to English?">
                        <input className="form-check-input"
                               type="checkbox" {...props.register("translateForeignLanguages")} />
                        <label className="form-check-label small">Translate foreign languages</label>
                    </div>
                </div>
                }
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
                        <div className="form-check form-switch"
                             title="Restful crawlers can be internal to the platform.">
                            <input className="form-check-input"
                                   type="checkbox" {...props.register("internalCrawler")}  />
                            <label className="form-check-label small">Internal crawler</label>

                        </div>
                    </div>
                }
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