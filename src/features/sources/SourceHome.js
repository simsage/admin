import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api, {IMAGES} from "../../common/api";
import api from "../../common/api";
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
    searchSource,
    showAddForm,
    showEditForm,
    showExportForm,
    showFailedDocuments,
    showImportForm,
    showProcessFilesAlert,
    showStartCrawlerAlert,
} from "./sourceSlice";
import {SourceStartDialog} from "./SourceStartDialog";
import {SourceProcessFilesDialog} from "./SourceProcessFilesDialog";
import {SourceErrorDialog} from "./SourceErrorDialog";
import "../../css/home.css";
import SourceFailures from "./SourceFailures";


//TODO:: No need to list documents anymore.

export default function SourceHome() {

    const dispatch = useDispatch();
    const theme = '';
    const session = useSelector((state) => state.authReducer.session);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    const show_start_crawler_prompt = useSelector((state) => state.sourceReducer.show_start_crawler_prompt);
    const source_filter = useSelector((state) => state.sourceReducer.source_filter);

    const show_process_files_prompt = useSelector((state) => state.sourceReducer.show_process_files_prompt);
    const show_error_form = useSelector((state) => state.sourceReducer.show_error_form);
    const show_failed_documents = useSelector((state) => state.sourceReducer.show_failed_docs);

    let source_list = useSelector((state) => state.sourceReducer.source_list);

    // const show_form_source = useSelector((state) => state.sourceReducer.show_data_form);
    const show_export_form = useSelector((state) => state.sourceReducer.show_export_form);
    const show_import_form = useSelector((state) => state.sourceReducer.show_import_form);

    const data_status = useSelector((state) => state.sourceReducer.data_status);

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const [selected_source, setSelectedSource] = useState(undefined)
    const [button_clicked, setButtonClicked] = useState(undefined);

    const [order_by, setOrderBy] = useState('id_asc') //
    const order_by_options = [
        {slug: 'id_asc', label: 'ID'},
        {slug: 'id_desc', label: 'ID Desc'},
        {slug: 'name_asc', label: 'Name'},
        {slug: 'name_desc', label: 'Name Desc'}
    ];

    const WARNING_IMAGE = "../images/warning.png"

    useEffect(() => {
        dispatch(getSources({
            session_id: session.id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_organisation_id, selected_knowledge_base_id, session?.id, data_status === "load_now"])


    function refresh_sources() {
        if (selected_organisation_id && selected_knowledge_base_id) {
            dispatch(getSources({
                session_id: session.id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id
            }))
        }
    }

    function sortList(order, source_list, name_filter) {
        let tempList = [...source_list]
        const order_by_id_asc = (a, b) => {
            return a.sourceId - b.sourceId
        }
        const order_by_id_desc = (a, b) => {
            return b.sourceId - a.sourceId
        }
        const order_by_name_asc = (a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        }
        const order_by_name_desc = (a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }

            // names must be equal
            return 0;
        }

        switch (order_by) {
            // {slug:'id_asc', label:'ID'},
            case 'id_asc':
                tempList.sort(order_by_id_asc);
                break;

            // {slug:'id_desc', label:'ID Desc'}
            case 'id_desc':
                tempList.sort(order_by_id_desc);
                break;
            // {slug:'name_asc', label:'Name'},
            case 'name_asc':
                tempList.sort(order_by_name_asc);
                break;
            // {slug:'name_desc', label:'Name Desc'}
            case 'name_desc':
                tempList.sort(order_by_name_desc);
                break;
            default:
                tempList.sort(order_by_id_asc);
                break;
        }
        const final_list = [];
        for (const temp of tempList) {
            if ((!name_filter || name_filter.length === 0) || temp.name.toLowerCase().indexOf(name_filter) >= 0) {
                final_list.push(temp);
            }
        }
        return final_list;
    }

    function getCrawlers() {

        let paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        let tempList = sortList(order_by, source_list, source_filter.toLowerCase().trim())

        for (const i in tempList) {
            if (i >= first && i < last) {
                paginated_list.push(tempList[i]);
            }
        }
        return paginated_list;
    }


    function handleEditCrawler(source) {
        if (source) {
            dispatch(showEditForm({source: source}));
        }
    }

    function handleShowFailedDocuments(source) {
        if (source) {
            dispatch(showFailedDocuments({source: source}));
        }
    }


    function deleteCrawler() {
        let source_id = selected_source.sourceId;
        dispatch(deleteSource({
            session_id: session.id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id,
            source_id: source_id
        }))
        dispatch(closeAlert())
    }


    function alertHandler() {
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
        if (crawler) {
            dispatch(showExportForm({source: crawler}))
        }
    }

    function handleImportCrawler() {
        dispatch(showImportForm())
    }

    function handleProcessFiles(source) {
        dispatch(showProcessFilesAlert({source: source}))
    }

    function handleStartCrawler(source) {
        dispatch(showStartCrawlerAlert({source: source}))
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
                if (crawler.numErrors > crawler.errorThreshold)
                    return "failed with " + crawler.numErrors + " errors at " + Api.unixTimeConvert(crawler.endTime);
                else
                    return "finished at " + Api.unixTimeConvert(crawler.endTime);
            }
        }
        return "?";
    }

    function saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            const crawler = JSON.parse(crawler_str);
            delete crawler.sourceId;
            this.saveCrawler(crawler);
        }
        this.setState({export_open: false, selected_source: {}});
    }

    function handleAddForm() {
        dispatch(showAddForm(true));
    }


    function handleSearchFilter(value) {
        dispatch(searchSource({keyword: value.trim()}))
    }


    function setError(title, errStr) {
    }

    const export_open = false;
    const export_upload = false;

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

            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text"
                            onChange={(event) => handleSearchFilter(event.target.value)}
                            value={source_filter}
                            placeholder={"Filter..."} className="form-control filter-search-input"/>

                    </div>
                    <div className="form-group me-2 small text-black-50 px-4">Order by</div>
                    <div className="form-group me-2">

                        <select placeholder="Filter" value={order_by} autoFocus={true}
                                className={"form-select filter-text-width " + theme}
                                onChange={(e) => setOrderBy(e.target.value)}>
                            {order_by_options.map((item, i) => {
                                return <option key={i} value={item.slug}>{item.label}</option>
                            })}

                        </select>
                    </div>
                </div>

                <div className="form-group ms-auto">
                    {selected_knowledge_base_id && selected_knowledge_base_id.length > 0 &&
                        <div className="d-flex">
                            <div className="btn" onClick={() => refresh_sources()}>
                                <img src={IMAGES.REFRESH_IMAGE}
                                     className="refresh-image"
                                     alt="refresh"
                                     title="refresh source-list"
                                />
                            </div>
                            <button className="btn btn-outline-primary text-nowrap ms-2"
                                    onClick={() => handleImportCrawler()}>Import Crawler
                            </button>
                            <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddForm()}> + Add
                                Source
                            </button>
                        </div>
                    }

                </div>
            </div>
            {
                <div className="source-page">
                    <table className="table">
                        <thead>
                        <tr>
                            <td className="small text-black-50 px-4">Name</td>
                            <td className="small text-black-50 px-4">Source ID#</td>
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
                                return (
                                    <tr key={crawler.sourceId}>
                                        <td className="pt-3 px-4 pb-3 fw-500 source-name-column-width">
                                            <div className="source-label">{crawler.name}</div>
                                            { crawler.sourceError && crawler.sourceError.created > 0 && crawler.sourceError.message &&
                                            <div className="row error-text m-1" title={Api.unixTimeConvert(crawler.sourceError.created) + "  :  " + crawler.sourceError.message}>
                                                <span className="col-2 d-flex warning-span">
                                                    <img alt="warning image" src={WARNING_IMAGE} className="warning-image"/>
                                                </span>
                                                <span className="col-10 d-flex warning-text mt-1">
                                                {"" + crawler.sourceError.message}
                                                </span>
                                            </div>
                                            }
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light">
                                        <div className="source-label">{crawler.sourceId}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="source-label">{crawler.crawlerType}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light small fst-italic">
                                            <div className="source-label small-label-size"
                                                 title={description}>{description}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light w-25">
                                            {/*<div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>*/}
                                            <div>
                                                <div>{`collected: ${crawler.numCrawledDocuments.toLocaleString()}`}</div>
                                                <div>{`converted: ${crawler.numConvertedDocuments.toLocaleString()}`}</div>
                                                <div>{`analyzed: ${crawler.numParsedDocuments.toLocaleString()}`}</div>
                                                <div>{`indexed: ${crawler.numIndexedDocuments.toLocaleString()}`}</div>
                                                <div>{`translated: ${crawler.numTranslatedDocuments.toLocaleString()}`}</div>
                                                <div>{`completed: ${crawler.numFinishedDocuments.toLocaleString()}`}</div>
                                                <div>{`failed: ${crawler.numErroredDocuments.toLocaleString()}`}</div>
                                                <div>{`total documents: ${crawler.numTotalDocuments.toLocaleString()}`}</div>

                                                <div>{`total failed:`}{crawler.numTotalErroredDocuments > 0 &&
                                                    <button title="view failed documents"
                                                            onClick={() => handleShowFailedDocuments(crawler)}
                                                            className={"btn error_doc_link"}>{crawler.numTotalErroredDocuments.toLocaleString()}
                                                    </button>}
                                                    {crawler.numTotalErroredDocuments === 0 &&
                                                        <span> {crawler.numTotalErroredDocuments.toLocaleString()}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pt-3 px-2 pb-0">
                                            <div className="d-flex justify-content-end">
                                                <button title="start crawler"
                                                        onClick={() => handleStartCrawler(crawler)}
                                                        className={"btn text-primary btn-sm"}>Start
                                                </button>
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
                                                <button title="remove crawler"
                                                        onClick={() => handleDeleteCrawler(crawler)}
                                                        className={"btn text-danger btn-sm"}>Remove
                                                </button>
                                            </div>
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
                <SourceStartDialog/>
            }

            {show_process_files_prompt &&
                <SourceProcessFilesDialog/>
            }

            {show_error_form &&
                <SourceErrorDialog/>
            }

            {show_failed_documents &&
                <>
                    <div>Whatever</div>
                    <SourceFailures/>
                </>
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