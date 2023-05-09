import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {Pagination} from "../../common/pagination";
import CrawlerImportExport from "./crawler-import-export";
import SourceEdit from "./SourceEdit";
import {closeAlert, showDeleteAlert} from "../alerts/alertSlice";
import AlertDialogHome from "../alerts/AlertDialogHome";
import {SourceExport} from "./SourceExport";
import {SourceImport} from "./SourceImport";
import {
    deleteSource,
    getSources,
    showAddForm,
    showEditForm,
    showExportForm, showImportForm, showProcessFilesAlert, showStartCrawlerAlert, showZipCrawlerAlert,
} from "./sourceSlice";
import {SourceStartDialog} from "./SourceStartDialog";
import {SourceZipDialog} from "./SourceZipDialog";
import {SourceProcessFilesDialog} from "./SourceProcessFilesDialog";
import {SourceErrorDialog} from "./SourceErrorDialog";
import api from "../../common/api";


//TODO:: No need to list documents anymore.

export default function SourceHome(props) {

    const dispatch = useDispatch();
    const theme = '';
    const session = useSelector((state) => state.authReducer.session);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    const show_start_crawler_prompt = useSelector((state) => state.sourceReducer.show_start_crawler_prompt)
    const show_zip_crawler_prompt = useSelector((state) => state.sourceReducer.show_zip_crawler_prompt)
    const show_process_files_prompt = useSelector((state) => state.sourceReducer.show_process_files_prompt)
    const show_error_form = useSelector((state) => state.sourceReducer.show_error_form)



    let source_list = useSelector((state) => state.sourceReducer.source_list);
    const source_list_status = useSelector((state) => state.sourceReducer.status);

    // const show_form_source = useSelector((state) => state.sourceReducer.show_data_form);
    const show_export_form = useSelector((state) => state.sourceReducer.show_export_form);
    const show_import_form = useSelector((state) => state.sourceReducer.show_import_form);

    const data_status = useSelector((state) => state.sourceReducer.data_status);

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);


    // const [selectedUser, setSelectedUser] = useState(null);
    const [searchFilter,setSearchFilter] = useState('');
    // const [orderFilter,setOrderFilter] = useState('');
    const [sourceFilter,setSourceFilter] = useState('');


    // const default_specific_json = '{"metadata_list":[' +
    //     '{"key":"created date range","display":"created","metadata":"created","db1":"","db2":"","sort":"true","sortDefault":"desc","sortAscText":"oldest documents first","sortDescText":"newest documents first", "fieldOrder": "0"},' +
    //     '{"key":"last modified date ranges","display":"last modified","metadata":"last-modified","db1":"","db2":"","sort":"true","sortDefault":"","sortAscText":"least recently modified","sortDescText":"most recently modified", "fieldOrder": "1"},' +
    //     '{"key":"document type","display":"document type","metadata":"document-type","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "2"}' +
    //     ']}';
    //
    // const empty_crawler = {
    //     id: '', sourceId: '0', crawlerType: '', name: '', deleteFiles: true, allowAnonymous: false,
    //     enablePreview: true, schedule: '', filesPerSecond: '0', specificJson: default_specific_json,
    //     processingLevel: 'SEARCH', nodeId: '0', maxItems: '0', maxQNAItems: '0', customRender: false, "acls": []
    // };

    const [selected_source, setSelectedSource] = useState(undefined)
    const [button_clicked, setButtonClicked] = useState(undefined);


    useEffect(() => {
        dispatch(getSources({
            session_id: session.id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))
    }, [selected_knowledge_base_id, session, props.tab, data_status === 'load_now'])


    function getCrawlers() {
        // const paginated_list = [];
        // const first = page * page_size;
        // const last = first + parseInt(page_size);

        // console.log("source_list",source_list);
        // source_list.sort((a, b) => { return a.sourceId - b.sourceId });
        // for (const i in source_list) {
        //     if (i >= first && i < last) {
        //         paginated_list.push(source_list[i]);
        //     }
        // }
        // for (const i in source_list) {
        //     if (i >= first && i < last) {
        //         paginated_list.push(source_list[i]);
        //     }
        // }

        return source_list;
    }


    function handleEditCrawler(source) {
        if (source) {
            dispatch(showEditForm({source: source}));
        }
    }


    function deleteCrawler() {
        let source_id = selected_source.sourceId;
        console.log("deleteOk is called ", source_id)
        dispatch(deleteSource({
            session_id: session.id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id,
            source_id: source_id
        }))
        dispatch(closeAlert())
    }


    function alertHandler() {
        console.log("alertHandler")
        if (button_clicked === 'remove_crawler') {
            deleteCrawler()
        } else if (button_clicked === 'reset_crawlers') {

        }
    }

    function handleDeleteCrawler(crawler) {
        if (crawler) {
            setSelectedSource(crawler)
            setButtonClicked('remove_crawler')
            const warning = {
                message: "Are you sure you want to remove the crawler named " + crawler.name + "?",
                title: "Remove Crawler"
            }
            dispatch(showDeleteAlert(warning))
        }
    }


    function handleExportCrawler(crawler) {

        console.log("handleExportCrawler", show_export_form)
        if (crawler) {
            dispatch(showExportForm({source: crawler}))
        }
    }

    function handleImportCrawler() {
        dispatch(showImportForm())
    }

    function handleZipSource(source) {
        dispatch(showZipCrawlerAlert({source:source}))
    }

    function handleProcessFiles(source) {
        dispatch(showProcessFilesAlert({source:source}))
    }

    function handleStartCrawler(source) {
        console.log("handleStartCrawler",source.name)
        dispatch(showStartCrawlerAlert({source:source}))
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

    // function onUpdate(crawler) {
    //     // this.setState({selected_source: crawler});
    //     // setSelectedSource(crawler)
    //     console.log(crawler)
    //     console.log(crawler.url)
    // }

    // function deleteCrawler(action) {
    //     if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
    //         this.props.deleteCrawler(this.state.crawler_ask.sourceId);
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }

    // function saveCrawler(crawler) {
    //     if (crawler) {
    //         console.log("crawler.sourceID :", crawler)
    //         console.log("crawler.sourceID :", crawler.sourceId)
    //         console.log("crawler.organisationId :", crawler.organisationId)
    //         console.log("crawler.kbId :", crawler.kbId)
    //
    //         dispatch(updateSources({session_id: session.id, data: crawler}))
    //     }
    //
    // }
    //
    // function canDeleteDocuments(crawler) {
    //     return crawler.crawlerType !== 'wordpress';
    // }

    function saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            const crawler = JSON.parse(crawler_str);
            delete crawler.sourceId;
            this.saveCrawler(crawler);
        }
        this.setState({export_open: false, selected_source: {}});
    }
    //
    // function zipSource(action) {
    //     if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
    //         const crawler = this.state.crawler_ask;
    //         this.props.zipSource(crawler);
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }
    //
    // function startCrawler(action) {
    //     if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
    //         const crawler = this.state.crawler_ask;
    //         this.props.startCrawler(crawler);
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }
    //
    // function resetCrawlers(action) {
    //     if (action) {
    //         this.props.resetCrawlers(selected_organisation_id, selected_knowledge_base_id);
    //     }
    //     if (this.props.closeDialog) {
    //         this.props.closeDialog();
    //     }
    // }
    //
    // //handle form close or cancel
    // const handleClose = () => {
    //     // clearFormData();
    //     console.log("handleClose Source Home")
    //     dispatch(closeForm);
    // }

    function handleAddForm(){
        console.log("handleAddNew")
        dispatch(showAddForm(true));
    }


    function handleSearchTextKeydown() {
        console.log("handleSearchTextKeydown")

        // if (e.key === "Enter" && this.props.selected_organisation_id) {
        //     this.props.getUsers(this.props.selected_organisation_id);
        // }
    }

    // function handleResetCrawlers() {
    //
    //     setButtonClicked('reset_crawlers')
    //     this.props.openDialog("Are you sure you want to reset all crawlers?  This will clear crawler schedules, and mark their files as out-of-date.",
    //         "Reset Crawlers", (action) => {
    //             this.resetCrawlers(action)
    //         });
    // }

    function setError(title, errStr) {
    }

    // function wpUploadArchive(data) {
    // }
    //
    // function message_callback(action) {
    // }

    // const open = show_form_source;
    // const source_title = 'Add/Edit Source';
    // const group_list = [];
    // const edge_device_list = [];
    // // const error_title = ''
    // // const error_msg = ''
    // const testCrawler = null

    const export_open = false;
    const export_upload = false;

    // const message = ""
    // const message_title = "message_title"

    return (
        <div className="section px-5 pt-4">

            <CrawlerImportExport
                open={export_open}
                theme={theme}
                upload={export_upload}
                crawler={selected_source}
                export_upload={export_upload}
                onSave={(crawler) => saveExport(crawler)}
                onError={(title, errStr) => setError(title, errStr)}
            />

            {/*<MessageDialog callback={(action) => message_callback(action)}*/}
            {/*               open={message.length > 0}*/}
            {/*               theme={theme}*/}
            {/*               message={message}*/}
            {/*               title={message_title}/>*/}

            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control filter-search-input " + theme}
                               onKeyPress={(e) => handleSearchTextKeydown(e)}
                               onChange={(e) => setSearchFilter(e.target.value)}/>
                    </div>
                    {/* <div className="form-group me-2">
                        <select  placeholder={"Filter"} autoFocus={true} className={"form-select filter-text-width " + theme}
                                 onChange={(e) => setOrderFilter(e.target.value)}>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="">Join</option>
                        </select>
                    </div> */}
                    <div className="form-group me-2">
                        <select type="text" placeholder={"Filter"} value={sourceFilter} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => setSourceFilter(e.target.value)}>
                            <option value="all-users">All Sources</option>
                        </select>
                    </div>
                </div>

                <div className="form-group ms-auto">
                    {selected_knowledge_base_id.length > 0 &&
                        <div className="d-flex">
                            {/*<button className="btn btn-outline-primary text-nowrap ms-2" onClick={() => handleResetCrawlers()} >Reset Crawlers </button>*/}
                            <button className="btn btn-outline-primary text-nowrap ms-2" onClick={() => handleImportCrawler()} >Upload Crawler</button>
                            <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddForm()}> + Add Source</button>
                        </div>
                    }

                </div>
            </div>
            {source_list_status !== undefined && source_list && source_list.length > 0 &&
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
                                        <td className="pt-3 px-4 pb-3 fw-500">
                                            <div className="source-label">{crawler.name}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="source-label">{crawler.crawlerType}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light small fst-italic">
                                            <div className="source-label small-label-size"
                                                 title={description}>{description}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light">
                                            {/*<div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>*/}
                                            <div>
                                                <div>{`collected: ${crawler.numCrawledDocuments}`}</div>
                                                <div>{`converted: ${crawler.numConvertedDocuments}`}</div>
                                                <div>{`analyzed: ${crawler.numParsedDocuments}`}</div>
                                                <div>{`indexed: ${crawler.numIndexedDocuments}`}</div>
                                                <div>{`completed: ${crawler.numFinishedDocuments}`}</div>
                                                <div>{`total documents: ${crawler.numTotalDocuments}`}</div>
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-0">
                                            {/*{!is_running &&*/}
                                            {/*<div className="link-button"*/}
                                            {/*     onClick={() => handleStartCrawler(crawler)}>*/}
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
                                            <div className="d-flex justify-content-end">
                                                {!is_running && <>
                                                    <button title="start crawler"
                                                            onClick={() => handleStartCrawler(crawler)}
                                                            className={"btn text-primary btn-sm"}>Start
                                                    </button>
                                                    </>}
                                                {is_running && <>
                                                    <button title="start crawler" disabled
                                                            className={"btn text-primary btn-sm"}>Start
                                                    </button>
                                                     </>}

                                                <button title="edit crawler" onClick={() => handleEditCrawler(crawler)}
                                                        className={"btn text-primary btn-sm"}>Edit
                                                </button>
                                                <button title="process all files for a source"
                                                        onClick={() => handleProcessFiles(crawler)}
                                                        className={"btn text-primary btn-sm text-nowrap"}>Process files
                                                </button>
                                                <button title="get crawler JSON for export"
                                                        onClick={() => handleExportCrawler(crawler)}
                                                        className={"btn text-primary btn-sm"}>Export
                                                </button>
                                                <button title="zip all files in a source"
                                                        onClick={() => handleZipSource(crawler)}
                                                        className={"btn text-primary btn-sm"}>Zip
                                                </button>
                                                <button title="remove crawler"
                                                        onClick={() => handleDeleteCrawler(crawler)}
                                                        className={"btn text-danger btn-sm"}>Remove
                                                </button>
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

            {show_start_crawler_prompt &&
                <SourceStartDialog />
            }
            {show_zip_crawler_prompt &&
                <SourceZipDialog />
            }

            {show_process_files_prompt &&
                <SourceProcessFilesDialog />
            }

            {show_error_form &&
                <SourceErrorDialog />
            }

            <SourceEdit/>

            <AlertDialogHome onOk={alertHandler}/>

            {show_export_form &&
                <SourceExport/>
            }

            {show_import_form &&
                <SourceImport/>
            }

        </div>
    )
}