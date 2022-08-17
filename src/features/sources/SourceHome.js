import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {Pagination} from "../../common/pagination";
import SourceFilter from "./SourceFilter";
import {closeForm, getSources, showAddForm, showEditForm, updateSources} from "./sourceSlice";
import CrawlerDialog from "./crawlers/crawler-dialog";
import MessageDialog from "../../common/message-dialog";
import CrawlerImportExport from "./crawler-import-export";

export default function SourceHome(){

    const dispatch = useDispatch();
    const title = "Source";
    const theme = '';
    const session = useSelector((state) => state.authReducer.session);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);

    let source_list = useSelector((state) => state.sourceReducer.source_list);
    const source_list_status = useSelector((state) => state.sourceReducer.status);

    const show_form_source = useSelector((state) => state.sourceReducer.show_form);


    const [page, setPage] = useState(0)
    const [page_size, setPageSize] = useState(10)

    const default_specific_json = '{"metadata_list":[' +
        '{"key":"created date range","display":"created","metadata":"created","db1":"","db2":"","sort":"true","sortDefault":"desc","sortAscText":"oldest documents first","sortDescText":"newest documents first", "fieldOrder": "0"},' +
        '{"key":"last modified date ranges","display":"last modified","metadata":"last-modified","db1":"","db2":"","sort":"true","sortDefault":"","sortAscText":"least recently modified","sortDescText":"most recently modified", "fieldOrder": "1"},' +
        '{"key":"document type","display":"document type","metadata":"document-type","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "2"}' +
        ']}';

    const empty_crawler= {id: '', sourceId: '0', crawlerType: '', name: '', deleteFiles: true, allowAnonymous: false,
        enablePreview: true, schedule: '', filesPerSecond: '0', specificJson: default_specific_json,
        processingLevel: 'SEARCH', nodeId: '0', maxItems: '0', maxQNAItems: '0', customRender: false, "acls": []};

    let [selected_source,setSelectedSource] = useState({})

    useEffect(()=>{
        console.log("Source Home 1",source_list_status,"--", source_list)
        // if(source_list_status === undefined || source_list === undefined ){
            console.log("Source Home 2")
            dispatch(getSources({session_id:session.id,organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id}))
        // }
    },[selected_knowledge_base_id,session])


    function getCrawlers() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);

        console.log("source_list",source_list);
        // source_list.sort((a, b) => { return a.sourceId - b.sourceId });
        // for (const i in source_list) {
        //     if (i >= first && i < last) {
        //         paginated_list.push(source_list[i]);
        //     }
        // }
        return source_list;
    }

    function getCrawlerStatus(crawler) {
        if (crawler) {
            if (crawler.startTime <= 0)
                return "never started";
            if (crawler.endTime > crawler.startTime && crawler.optimizedTime > crawler.endTime)
                return "up to date since " + Api.unixTimeConvert(crawler.startTime);
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime > 0)
                    return "schedule disabled: last finished " + Api.unixTimeConvert(crawler.endTime);
                else if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime <= 0)
                    return "schedule disabled";
                else
                    return "running: started on " + Api.unixTimeConvert(crawler.startTime);
            }
            if (crawler.endTime > crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime > 0)
                    return "schedule disabled: last finished " + Api.unixTimeConvert(crawler.endTime);
                if (crawler.numErrors === 0)
                    return "finished at " + Api.unixTimeConvert(crawler.startTime);
                else if (crawler.numErrors > crawler.errorThreshold)
                    return "failed with " + crawler.numErrors + " errors at " + Api.unixTimeConvert(crawler.startTime);
                else
                    return "finished at " + Api.unixTimeConvert(crawler.startTime);
            }
        }
        return "?";
    }

    function isCrawlerRunning(crawler) {
        if (crawler) {
            if (crawler.startTime <= 0)
                return false;
            if (crawler.endTime > crawler.startTime && crawler.optimizedTime > crawler.endTime)
                return false;
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0)
                    return false;
                else
                    return true;
            }
            if (crawler.endTime > crawler.startTime) {
                return false;
            }
        }
        return false;
    }

    function addNewCrawler() {
        dispatch(showAddForm());
        this.setState({open: true, selected_source: empty_crawler, title: 'Create New Crawler'});
    }
    function onUpdate(crawler) {
        // this.setState({selected_source: crawler});
        // setSelectedSource(crawler)
        console.log(crawler)
        console.log(crawler.url)
    }
    function editCrawler(source) {
        if (source) {
            console.log("crawler",source)
            dispatch(showEditForm({source_id:source.sourceId, source:source}));
            // this.setState({open: true, selected_source: { ...empty_crawler, ...crawler}, title: 'Edit Crawler'});
        }
    }
    function deleteCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to remove the crawler named <b>" + crawler.name + "</b>?",
            "Remove Crawler", (action) => { this.deleteCrawler(action) });
    }

    function deleteCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            this.props.deleteCrawler(this.state.crawler_ask.sourceId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function saveCrawler(crawler) {
        if (crawler) {
            console.log("crawler.sourceID :",crawler )
            console.log("crawler.sourceID :",crawler.sourceId )
            console.log("crawler.organisationId :",crawler.organisationId )
            console.log("crawler.kbId :",crawler.kbId )

            dispatch(updateSources({session_id:session.id,data:crawler}))
            // crawler.organisationId = selected_organisation_id;
            // crawler.kbId = selected_knowledge_base_id;
            // this.props.updateCrawler(crawler);
        }

        //dispatch(closeForm())
        // this.setState({open: false});
    }
    function canDeleteDocuments(crawler) {
        return crawler.crawlerType !== 'wordpress';
    }
    function exportCrawler(crawler) {
        this.setState({selected_source: crawler, export_upload: false, export_open: true})
    }
    function importCrawler() {
        this.setState({selected_source: {}, export_upload: true, export_open: true})
    }
    function saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            const crawler = JSON.parse(crawler_str);
            delete crawler.sourceId;
            this.saveCrawler(crawler);
        }
        this.setState({export_open: false, selected_source: {}});
    }
    function zipSourceAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to zip the content of <b>" + crawler.name + "</b>?",
            "Zip Source", (action) => { this.zipSource(action) });
    }
    function zipSource(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.zipSource(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function startCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to start <b>" + crawler.name + "</b>?",
            "Start Crawler", (action) => { this.startCrawler(action) });
    }
    function startCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.startCrawler(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function resetCrawlersAsk() {
        this.props.openDialog("Are you sure you want to reset all crawlers?  This will clear crawler schedules, and mark their files as out-of-date.",
            "Reset Crawlers", (action) => { this.resetCrawlers(action) });
    }
    function resetCrawlers(action) {
        if (action) {
            this.props.resetCrawlers(selected_organisation_id, selected_knowledge_base_id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }



    //handle form close or cancel
    const handleClose = () => {
        // clearFormData();
        console.log("handleClose Source Home")
        dispatch(closeForm);
    }


    function setError(title,errStr) {}
    function wpUploadArchive(data) {}
    function message_callback(action) {}

    const open = show_form_source;
    const source_title = 'Add/Edit Source';
    const group_list = [];
    const edge_device_list = [];
    const error_title = ''
    const error_msg = ''
    const testCrawler = null

    const export_open = false;
    const export_upload = false;


    const message = ""
    const message_title = "message_title"

    return(
        <div className="section px-5 pt-4">

            <CrawlerDialog
                open={open}
                title={source_title}
                theme={theme}
                session={session}
                organisation_id={selected_organisation_id}
                kb_id={selected_knowledge_base_id}
                user_list={user_list}
                onSave={(crawler) => saveCrawler(crawler)}
                onUpdate={(crawler) => onUpdate(crawler)}
                onError={(title, errStr) => setError(title, errStr)}
                error_title={error_title}
                error_msg={error_msg}
                wpUploadArchive={(data) => wpUploadArchive(data) }
                group_list={group_list}
                crawler={selected_source}
                edge_device_list={edge_device_list}
                testCrawler={testCrawler}
                onClose={handleClose}
            />


            <CrawlerImportExport
                open={export_open}
                theme={theme}
                upload={export_upload}
                crawler={selected_source}
                export_upload={export_upload}
                onSave={(crawler) => saveExport(crawler) }
                onError={(title, errStr) => setError(title, errStr)}
            />

            <MessageDialog callback={(action) => message_callback(action)}
                           open={message.length > 0}
                           theme={theme}
                           message={message}
                           title={message_title} />

            <SourceFilter />
            { source_list_status !== undefined && source_list && source_list.length > 0 &&
                <div className="source-page">
                    <table className="table">
                        <thead>
                        <tr>
                            <td className="small text-black-50 px-4">#</td>
                            <td className="small text-black-50 px-4">Name</td>
                            <td className="small text-black-50 px-4">Type</td>
                            <td className="small text-black-50 px-4">Status</td>
                            <td className="small text-black-50 px-4">Crawled/Indexed</td>
                            <td className="small text-black-50 px-4"></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getCrawlers().map((crawler) => {
                                const description = getCrawlerStatus(crawler);
                                const is_running = isCrawlerRunning(crawler);
                                return (
                                    <tr key={crawler.sourceId}>
                                        <td className="pt-3 px-4 pb-3 fw-light">
                                            <div className="source-label">{crawler.sourceId}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="source-label">{crawler.name}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="source-label">{crawler.crawlerType}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light small fst-italic">
                                            <div className="source-label small-label-size" title={description}>{description}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light">
                                            <div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-0">
                                            {/*{!is_running &&*/}
                                            {/*<div className="link-button"*/}
                                            {/*     onClick={() => startCrawlerAsk(crawler)}>*/}
                                            {/*    <img src="../images/play.svg" className="image-size"*/}
                                            {/*         title="start this crawler" alt="start"/>*/}
                                            {/*</div>*/}
                                            {/*}*/}
                                            {/*{is_running &&*/}
                                            {/*<div className="link-button">*/}
                                            {/*    <img src="../images/play-disabled.svg" className="image-size"*/}
                                            {/*         title="crawler running" alt="start"/>*/}
                                            {/*</div>*/}
                                            {/*}*/}
                                            <div className="d-flex">
                                                {!is_running && <><button title="start crawler" onClick={() => startCrawlerAsk(crawler)}  className={"btn text-primary btn-sm"}>Start</button>&nbsp; &nbsp;</> }
                                                {is_running && <><button title="start crawler" disabled className={"btn text-primary btn-sm"}>Start</button>&nbsp; &nbsp; </>}

                                                <button title="edit crawler" onClick={() => editCrawler(crawler)}  className={"btn text-primary btn-sm"}>Edit</button>&nbsp; &nbsp;
                                                <button title="remove crawler" onClick={() => deleteCrawlerAsk(crawler)}  className={"btn text-danger btn-sm"}>Remove</button>&nbsp; &nbsp;
                                                <button title="get crawler JSON for export" onClick={() => exportCrawler(crawler)}  className={"btn text-primary btn-sm"}>Export</button>&nbsp; &nbsp;
                                                <button title="zip all files in a source" onClick={() => zipSourceAsk(crawler)}  className={"btn text-primary btn-sm"}>Zip</button>&nbsp; &nbsp;
                                            </div>
                                            {/*<div className="link-button" onClick={() => editCrawler(crawler)}>*/}
                                            {/*    <img src="../../images/edit.svg" className="image-size" title="edit crawler" alt="edit"/>*/}
                                            {/*</div>*/}
                                            {/*<div className="link-button" onClick={() => deleteCrawlerAsk(crawler)}>*/}
                                            {/*    <img src="../images/delete.svg" className="image-size" title="remove crawler" alt="remove"/>*/}
                                            {/*</div>*/}
                                            {/*<div className="link-button" onClick={() => exportCrawler(crawler)}>*/}
                                            {/*    <img src="../images/download.svg" className="image-size" title="get crawler JSON for export" alt="export"/>*/}
                                            {/*</div>*/}
                                            {/*<div className="link-button" onClick={() => zipSourceAsk(crawler)}>*/}
                                            {/*    <img src="../images/zip.svg" className="image-size" title="zip all files in a source" alt="zip files"/>*/}
                                            {/*</div>*/}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td/>
                            <td>
                                {/* Siva - Can we place this in SourceFilter.js please */}
                                {selected_organisation_id.length > 0 &&
                                <div className="image-button" >
                                    <button onClick={() => addNewCrawler()} className={"btn btn-primary p-1"}>Add New Source</button>
                                </div>
                                }
                                {selected_knowledge_base_id.length > 0 &&
                                <div className="image-button" >
                                    <button onClick={() => resetCrawlersAsk()} className={"btn btn-primary"}>reset crawlers</button>
                                </div>
                                }
                                {selected_organisation_id.length > 0 &&
                                <div className="image-button" >
                                    <button onClick={() => importCrawler()} className={"btn btn-primary"}>upload crawler JSON</button>
                                </div>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={source_list.length}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rows) => setPageSize(rows)}
                    />



                </div>
            }

        </div>
    )
}