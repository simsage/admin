import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api, {age, convert_gmt_to_local} from "../../common/api";
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
    setSourceItemsExpanded,
    showAddForm,
    showEditForm,
    showExportForm,
    showFailedDocuments,
    showImportForm,
    showPauseCrawlerAlert,
    showProcessFilesAlert,
    showStartCrawlerAlert,
    showStopCrawlerAlert
} from "./sourceSlice";
import {SourceStartDialog} from "./SourceStartDialog";
import {SourceProcessFilesDialog} from "./SourceProcessFilesDialog";
import {SourceErrorDialog} from "./SourceErrorDialog";
import "../../css/home.css";
import SourceFailures from "./SourceFailures";
import CustomSelect from "../../components/CustomSelect";
import {SourceStopDialog} from "./SourceStopDialog";
import {SourcePauseDialog} from "./SourcePauseDialog";

// source landing page - show all sources in a paginated set
export default function SourceHome() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    const show_start_crawler_prompt = useSelector((state) => state.sourceReducer.show_start_crawler_prompt);
    const show_stop_crawler_prompt = useSelector((state) => state.sourceReducer.show_stop_crawler_prompt);
    const show_pause_crawler_prompt = useSelector((state) => state.sourceReducer.show_pause_crawler_prompt);
    const source_filter = useSelector((state) => state.sourceReducer.source_filter);
    const source_control_status = useSelector((state) => state.sourceReducer.source_control_status);
    const source_item_expanded = useSelector((state) => state.sourceReducer.source_item_expanded);

    const show_process_files_prompt = useSelector((state) => state.sourceReducer.show_process_files_prompt);
    const show_error_form = useSelector((state) => state.sourceReducer.show_error_form);
    const show_failed_documents = useSelector((state) => state.sourceReducer.show_failed_docs);

    let source_list = useSelector((state) => state.sourceReducer.source_list) ?? [];

    // const show_form_source = useSelector((state) => state.sourceReducer.show_data_form);
    const show_export_form = useSelector((state) => state.sourceReducer.show_export_form);
    const show_import_form = useSelector((state) => state.sourceReducer.show_import_form);
    const busy = useSelector((state) => state.sourceReducer.busy);

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const [selected_source, setSelectedSource] = useState(undefined)
    const [button_clicked, setButtonClicked] = useState(undefined);
    const [local_source_filter, setLocalSourceFilter] = useState(source_filter ?? '');

    const [order_by, setOrderBy] = useState('id_asc') //
    const order_by_options = [
        {slug: 'id_asc', label: 'ID'},
        {slug: 'id_desc', label: 'ID Desc'},
        {slug: 'name_asc', label: 'Name'},
        {slug: 'name_desc', label: 'Name Desc'}
    ];

    const WARNING_IMAGE = "images/warning.png"

    useEffect(() => {
        if (selected_organisation_id && selected_knowledge_base_id && session) {
            dispatch(getSources({
                session_id: session.id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selected_organisation_id, selected_knowledge_base_id, session, source_control_status
    ])

    function toggle_open(key) {
        let content_copy = JSON.parse(JSON.stringify(source_item_expanded))
        console.log(content_copy)
        if (content_copy.hasOwnProperty(key)) {
            content_copy[key] = !content_copy[key];
        } else {
            content_copy[key] = true
        }
        dispatch(setSourceItemsExpanded(content_copy))
    }

    function refresh_sources() {
        if (!busy && selected_organisation_id &&
            selected_knowledge_base_id && session?.id) {
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
            const source_id = "" + (temp.sourceId ?? "")
            if ((!name_filter || name_filter.length === 0) ||
                temp.name.toLowerCase().indexOf(name_filter) >= 0 ||
                source_id.indexOf(name_filter) >= 0) {
                final_list.push(temp);
            }
        }
        return final_list;
    }

    function getCrawlers() {

        let paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        let tempList = sortList(order_by, source_list, source_filter?.toLowerCase()?.trim() ?? '')

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
            source_id: source_id,
            on_success: () => {
                dispatch(getSources({
                    session_id: session.id,
                    organisation_id: selected_organisation_id,
                    kb_id: selected_knowledge_base_id
                }))
            }
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
                message: "Are you sure you want to remove the crawler named\n" + crawler.name +
                    "?\n\n\nThis will remove all associated Documents/Records on this platform.\n" +
                    "Data is in this source will no longer be usable.\n",
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

    function handleStopCrawler(source) {
        dispatch(showStopCrawlerAlert({source: source}))
    }

    function handlePauseCrawler(source) {
        dispatch(showPauseCrawlerAlert({source: source}))
    }

    /**
     * return a string for the Status column on the Sources home page (list of sources)
     *
     * @param crawler the crawler to return a Status description for
     * @returns {string} a status description for that crawler
     */
    function getCrawlerStatus(crawler) {
        if (crawler) {
            const key = crawler.kbId + ":" + crawler.sourceId
            const is_open = source_item_expanded[key]
            if (crawler.startTime <= 0)
                return "*never started"

            // are we scheduled to do anything?
            const has_schedule = Api.defined(crawler.schedule) && crawler.schedule.length > 0

            if (crawler.stopped) {
                if (has_error(crawler)) {
                    return "*stopped: error";
                }
                return "*stopped";
            }
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                if (!has_schedule) {
                    if (!is_open) return "*disabled"
                    return "*disabled\n\nstarted\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime))

                } else if (!crawler.scheduleEnable) {
                    if (!is_open) return "*paused"
                    return "*paused\n\nstarted\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime))

                } else {
                    if (!is_open) return "*running"
                    const age_str = age(crawler.startTime, Date.now())
                    if (age_str !== "") {
                        return "*running\n\nstarted on\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime)) +
                            "\n\ntime taken\n" + age_str;
                    }
                    return "*running\n\nstarted on\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime));
                }
            }
            if (crawler.endTime > crawler.startTime) {
                if (!has_schedule && crawler.endTime > 0) {
                    if (!is_open) return "*disabled"
                    return "*disabled\n\nlast finished\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.endTime))
                } else if (!has_schedule) {
                    return "*disabled"
                }

                if (crawler.expectedFileCount > 0 && crawler.numTotalDocuments < crawler.expectedFileCount) {
                    if (!is_open) return "*failed"
                    return "*failed\n\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.endTime));
                } else {
                    if (!is_open) return "*finished"
                    const age_str = age(crawler.startTime, crawler.endTime)
                    if (age_str !== "") {
                        return "*finished\n\n" +
                            "*started\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime)) +
                            "\n\n*finished\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.endTime)) +
                            "\n\ntook " + age_str;
                    }
                    return "*finished\n\n" +
                        "*started\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.startTime)) +
                        "\n\n*finished\n" + Api.unixTimeConvert(convert_gmt_to_local(crawler.endTime));

                }
            }
        }
        return "";
    }

    /**
     * can this crawler start?
     * @param crawler the crawler to return a Status description for
     * @returns true if it isn't already running and has a valid schedule
     */
    function can_start(crawler) {
        if (crawler) {
            // if the crawler was stopped, we can start it
            if (crawler.stopped) return true
            // are we scheduled to do anything?
            const has_schedule = Api.defined(crawler.schedule) && crawler.schedule.length > 0
            if (!has_schedule) return false
            // is it running right now?
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                return false
            }
            // is it done
            if (crawler.endTime > crawler.startTime) {
                return true
            }
            // never started before?
            if (crawler.startTime <= 0) return true
        }
        return false
    }


    /**
     * is this crawler running right now?
     * @param crawler the crawler to return a Status description for
     * @returns true if it is running
     */
    function is_running(crawler) {
        if (crawler) {
            // are we scheduled to do anything?
            const has_schedule = Api.defined(crawler.schedule) && crawler.schedule.length > 0
            if (!has_schedule) return false
            if (crawler.stopped) return false
            // is it running right now?
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                return true
            }
        }
        return false
    }


    /**
     * is this crawler paused?
     * @param crawler the crawler to return a Status description for
     * @returns true if it is running
     */
    function is_pause_enabled(crawler) {
        if (crawler) {
            // are we scheduled to do anything?
            const has_schedule = Api.defined(crawler.schedule) && crawler.schedule.length > 0
            if (!has_schedule) return false
            // have we stopped (no schedule, but enabled)
            if (crawler.stopped) return false
            // are we currently paused?
            if (!crawler.scheduleEnable) return true
            // is it running right now?
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                return true
            }
        }
        return false
    }


    function saveExport() {
        this.setState({export_open: false, selected_source: {}});
    }

    function handleAddForm() {
        dispatch(showAddForm(true));
    }


    function handleSearchFilter(value) {
        setPage(0)
        setLocalSourceFilter(value.trim())
        dispatch(searchSource({keyword: value.trim()}))
    }


    function setError(title, errStr) {
    }

    function delta(crawler) {
        if (crawler && crawler.hasDeltaValues) {
            return "Δ "
        }
        return ""
    }

    const pretty_error_message = (source) => {
        if (source && source.sourceError && source.sourceError.message) {
            if (source.sourceError.message.length > 128) {
                return source.sourceError.message.substring(0, 128) + " ..."
            }
            return source.sourceError.message
        }
        return ""
    }

    const has_error = (source) => {
        if (source && source.sourceError && source.sourceError.message) {
            return source.sourceError.message.length > 0
        }
        return false
    }

    // --- Chevron Right Icon (for collapsed state) ---
    const ChevronRightIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{ verticalAlign: 'middle' }} // Helps align with text
        >
            {/* This path draws the chevron pointing right */}
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );

    // --- Chevron Down Icon (for expanded state) ---
    const ChevronDownIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{ verticalAlign: 'middle' }} // Helps align with text
        >
            {/* This path draws the chevron pointing down */}
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );

    const export_open = false;
    const export_upload = false;

    return (
        <div className="section px-5 pt-4">
            <CrawlerImportExport
                open={export_open}
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
                            value={local_source_filter}
                            placeholder={"Filter..."} className="form-control filter-search-input"/>

                    </div>
                    <div className={"form-group me-2 small px-4" + (theme === "light" ? " text-black-50" : " text-white-50")}>Order by</div>
                    <div className="form-group me-2" style={{ minWidth: "150px" }}>
                        <CustomSelect
                            options={order_by_options.map(option => (
                                { key: option.slug, value: option.label }
                            ))}
                            defaultValue={order_by}
                            onChange={(e) => setOrderBy(e)}
                            label="Filter"
                            disabled={false}
                        />
                    </div>
                </div>

                <div className="form-group ms-auto">
                    {selected_knowledge_base_id && selected_knowledge_base_id.length > 0 &&
                        <div className="d-flex">
                            <div className="btn"
                                 onClick={() => refresh_sources()}>
                                <img src={REFRESH_IMAGE}
                                     className="refresh-image"
                                     alt="refresh"
                                     title="refresh source-list"
                                />
                            </div>
                            <button className="btn btn-outline-primary text-nowrap ms-2"
                                    disabled={busy}
                                    onClick={() => handleImportCrawler()}>Import Crawler
                            </button>
                            <button className="btn btn-primary text-nowrap ms-2"
                                    disabled={busy}
                                    onClick={() => handleAddForm()}> + Add Source
                            </button>
                        </div>
                    }

                </div>
            </div>
            {
                <div className="source-page">
                    <table className={theme === "light" ? "table" : "table-dark"}>
                        <thead>
                        <tr>
                            <td></td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Name</td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Source ID#</td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Type</td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Status</td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Crawled/Indexed</td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getCrawlers().map((crawler) => {
                                const description = getCrawlerStatus(crawler);
                                const key = crawler.kbId + ":" + crawler.sourceId
                                return (
                                    <tr key={crawler.sourceId}>
                                        <td className="pt-3 source-open-close" title={source_item_expanded[key] ? "hide details" : "click to expand and show details"}
                                            onClick={() => toggle_open(key)}>
                                            <div className="pointer-default">
                                                {source_item_expanded[key] ? ChevronDownIcon({}) : ChevronRightIcon({})}
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-500 source-name-column-width">
                                            <div className="source-label pointer-default"
                                                 title={crawler.name + " (" + crawler.sourceId + ")"}>
                                                {crawler.name}
                                            </div>
                                            <div className={"m-2"}>
                                                <button
                                                    disabled={crawler.isExternal || !can_start(crawler)}
                                                    title={crawler.isExternal ?
                                                        "External crawlers cannot be started from the Admin UI" :
                                                        "Start this crawler.."
                                                    }
                                                    onClick={() => handleStartCrawler(crawler)}
                                                    className={"btn btn-sm border-0 bi bi-play-fill"}
                                                    style={{fontSize: '1.5rem'}}
                                                >
                                                </button>
                                                <button
                                                    disabled={(crawler.isExternal || !is_pause_enabled(crawler))}
                                                    title={crawler.scheduleEnable ? "Pause this crawler (disable its schedule)" : "Unpause this crawler (enable its schedule)"}
                                                    onClick={() => handlePauseCrawler(crawler)}
                                                    className={"btn btn-sm border-0 bi-pause-fill"}
                                                    style={{fontSize: '1.5rem'}}>
                                                </button>
                                                <button
                                                    disabled={!is_running(crawler)}
                                                    title={crawler.isExternal ? "External crawler: clear all current jobs in its queue" : "Stop this crawler from running and clear all the jobs it has queued."}
                                                    onClick={() => handleStopCrawler(crawler)}
                                                    className={"btn btn-sm border-0 bi-stop-fill"}
                                                    style={{fontSize: '1.5rem'}}>
                                                </button>
                                                <button
                                                    disabled={is_running(crawler)}
                                                    title="Reprocess all Documents/Records for a source (or mark every file in this source as changed)"
                                                    onClick={() => handleProcessFiles(crawler)}
                                                    className={"btn border-0 btn-sm bi-arrow-counterclockwise"}
                                                    style={{fontSize: '1.5rem'}}>
                                                </button>
                                                <button title="Edit/Change the details of this source."
                                                        onClick={() => handleEditCrawler(crawler)}
                                                        className={"btn btn-sm bi-pencil-square"}
                                                        style={{fontSize: '1.5rem'}}>
                                                </button>
                                                <button
                                                    title="Create a JSON export of this source's details (will exclude sensitive security information such as passwords)"
                                                    onClick={() => handleExportCrawler(crawler)}
                                                    className={"btn btn-sm bi-download"}
                                                    style={{fontSize: '1.5rem'}}>
                                                </button>
                                                <button
                                                    title="Remove this source and all associated Documents/Records."
                                                    onClick={() => handleDeleteCrawler(crawler)}
                                                    className={"btn text-danger btn-sm bi-trash"}
                                                    style={{fontSize: '1.5rem'}}>
                                                </button>
                                            </div>
                                            { crawler.sourceError && crawler.sourceError.created > 0 && crawler.sourceError.message && source_item_expanded[key] &&
                                            <div className="row error-text m-1" title={Api.unixTimeConvert(crawler.sourceError.created) + "  :  " + crawler.sourceError.message}>
                                                <span className="col-2 d-flex warning-span">
                                                    <img alt="warning" src={WARNING_IMAGE} className="warning-image"/>
                                                </span>
                                                <span className="col-10 d-flex warning-text mt-1" title={crawler.sourceError.message}>
                                                {"" + pretty_error_message(crawler)}
                                                </span>
                                            </div>
                                            }
                                        </td>
                                        <td className="pt-3 px-4 pb-3 source-home-small-column-width fw-light">
                                        <div className="source-label">{crawler.sourceId}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 source-home-small-column-width">
                                            <div className="source-label">{crawler.crawlerType}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light small fst-italic source-home-small-column-width">
                                            <div className="source-label small-label-size"
                                                 title={description.replace('*', '')}>
                                                {
                                                    description.split('\n').map((line) => {
                                                        if (line.indexOf('*') === 0) {
                                                            return <div><b>{line.substring(1)}</b>&nbsp;</div>
                                                        }
                                                        return <div>{line}&nbsp;</div>
                                                    })
                                                }
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light source-home-numbers-width">
                                            {/*<div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>*/}
                                            {source_item_expanded[key] &&
                                            <div className="pointer-default">
                                                <div className="border-top"
                                                    title="Documents/Records collected by the crawler, including inventory only Documents/Records.  This counter does not include failed documents.">
                                                    <span>{`${delta(crawler)}collected: ${crawler.numCrawledDocuments.toLocaleString()}`}</span>
                                                    <span className="float-end fst-italic">current run</span>
                                                </div>
                                                <div
                                                    title="Documents/Records converted to text by the conversion system">
                                                    {`${delta(crawler)}converted: ${crawler.numConvertedDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records processed by the language analyzer system">
                                                    {`${delta(crawler)}analyzed: ${crawler.numParsedDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records indexed (made searchable) by the indexing system">
                                                    {`${delta(crawler)}indexed: ${crawler.numIndexedDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records translated to English (if applicable)">
                                                    {`${delta(crawler)}translated: ${crawler.numTranslatedDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records that have preview generated for them">
                                                    {`${delta(crawler)}previews: ${crawler.numFinishedDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records failed (not able to process) in this run">
                                                    {`${delta(crawler)}failed: ${crawler.numErroredDocuments.toLocaleString()}`}</div>
                                                <div
                                                    title="Documents/Records inventory-only in this run">
                                                    {`${delta(crawler)}inventory-only: ${crawler.numInventoryDocuments.toLocaleString()}`}</div>
                                                <div className="mt-2 pt-2 border-top"
                                                    title="Documents/Records in inventory (not processed) total">
                                                    <span>{`${delta(crawler)}total inventory-only: ${crawler.numTotalInventoryDocuments.toLocaleString()}`}</span>
                                                    <span className="float-end fst-italic">totals</span>
                                                </div>
                                                <div
                                                    title="The total number of Documents/Record errors in this source.  This number is reset for full-runs through the data, and kept for crawlers that pick up changes only (delta crawlers).">
                                                    <span>{`total failed:`}</span>{crawler.numTotalErroredDocuments > 0 &&
                                                    <span title="view failed documents"
                                                            onClick={() => handleShowFailedDocuments(crawler)}
                                                            className={"error_doc_link ms-2 pointer-cursor"}>{crawler.numTotalErroredDocuments.toLocaleString()}
                                                    </span>
                                                    }
                                                    {crawler.numTotalErroredDocuments === 0 &&
                                                        <span> {crawler.numTotalErroredDocuments.toLocaleString()}</span>}
                                                </div>
                                                <div
                                                     title="the total number of Documents/Records in this source that were successfully processed">
                                                    {`total documents: ${crawler.numTotalDocuments.toLocaleString()}`}
                                                </div>
                                            </div>
                                            }
                                            {!source_item_expanded[key] &&
                                                <div className="pointer-default">
                                                    <div
                                                        title="The total number of Documents/Record errors in this source.  This number is reset for full-runs through the data, and kept for crawlers that pick up changes only (delta crawlers).">
                                                        <span>{`total failed:`}</span>{crawler.numTotalErroredDocuments > 0 &&
                                                        <span title="view failed documents"
                                                              onClick={() => handleShowFailedDocuments(crawler)}
                                                              className={"error_doc_link ms-2 pointer-cursor"}>{crawler.numTotalErroredDocuments.toLocaleString()}
                                                    </span>
                                                    }
                                                        {crawler.numTotalErroredDocuments === 0 &&
                                                            <span> {crawler.numTotalErroredDocuments.toLocaleString()}</span>}
                                                    </div>
                                                    <div
                                                        title="the total number of Documents/Records in this source that were successfully processed">
                                                        {`total documents: ${crawler.numTotalDocuments.toLocaleString()}`}
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div>&nbsp;</div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 20]}
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

            {show_start_crawler_prompt && <SourceStartDialog/>}
            {show_stop_crawler_prompt && <SourceStopDialog/>}
            {show_pause_crawler_prompt && <SourcePauseDialog/>}

            {show_process_files_prompt &&
                <SourceProcessFilesDialog/>
            }

            {show_error_form &&
                <SourceErrorDialog/>
            }

            {show_failed_documents &&
                <>
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