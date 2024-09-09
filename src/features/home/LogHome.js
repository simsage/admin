import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import Api from "../../common/api"
import {
    getLogs,
    setLogType,
    setLogService,
    setNumLogLines,
} from "./homeSlice"
import {LogErrorDialog} from "./LogErrorDialog"
import CustomSelect from "../../components/CustomSelect"
import {CSSTransition, TransitionGroup} from "react-transition-group"
import "./LogHome.css"
import DOMPurify from 'dompurify'

const service_list = [
    {key: "Auth", value: "Auth Service"},
    {key: "Conv", value: "Conversion Service"},
    {key: "Crawler", value: "Crawler Service"},
    {key: "DataProject", value: "Data Project Service"},
    {key: "Document", value: "Document Service"},
    {key: "Discovery", value: "Discovery Service"},
    {key: "Index", value: "Index Service"},
    {key: "KB", value: "Knowledge Base Service"},
    {key: "Language", value: "Language Service"},
    {key: "Search", value: "Search Service"},
    {key: "Stats", value: "Stats Service"},
    {key: "Cloud", value: "Web/Cloud Service"},
]

export default function LogHome() {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const log_type = useSelector((state) => state.homeReducer.log_type)
    const log_service = useSelector((state) => state.homeReducer.log_service)
    const log_lines = useSelector((state) => state.homeReducer.log_lines)
    const log_list = useSelector((state) => state.homeReducer.log_list)
    const filtered_list = useSelector((state) => state.homeReducer.log_filtered_list)

    // log filter text
    const [filter, setFilter] = useState('')

    const [log_refresh, setLogRefreshState] = useState(0)

    const getLogsLocal = (log_type, log_service, log_lines, filter) => {
        if (session && session.id && organisation_id) {
            dispatch(
                getLogs({
                    session_id: session.id,
                    organisation_id,
                    log_type,
                    log_service,
                    log_lines,
                    filter
                })
            )
        }
    }

    useEffect(() => {
        getLogsLocal(log_type, log_service, log_lines, filter)

        if (window.log_timer) {
            clearInterval(window.log_timer)
            window.log_timer = null
        }

        if (log_refresh > 0) {
            window.log_timer = setInterval(() => {
                getLogsLocal(log_type, log_service, log_lines)
            }, log_refresh * 1000)
        }

        return () => {
            if (window.log_timer) {
                clearInterval(window.log_timer)
                window.log_timer = null
            }
        }
    }, [session, organisation_id, log_type, log_service, log_lines, log_refresh])

    const check_keydown = (event) => {
        if (event && event.key === 'Enter') {
            event.preventDefault()
            getLogsLocal(log_type, log_service, log_lines, filter)
        }
    }

    const getClassForType = (type) => {
        switch (type) {
            case "DEBUG":
                return "log-type-debug"
            case "INFO":
                return "log-type-info"
            case "ERROR":
                return "log-type-error"
            default:
                return "log-type-warn"
        }
    }

    // download the log file for a given service by service-name from the server
    const download = (log) => {
        if (session && session.id) {
            const url = window.ENV.api_base + '/stats/system-log-download/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(log)
            Api.do_fetch(url, session.id)
        }
    }


    function highlightText(text, filter) {
        if (!filter) return DOMPurify.sanitize(text);
        const regex = new RegExp(`(${filter})`, 'gi');
        const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
        return DOMPurify.sanitize(highlightedText);
    }


    const getSelectedLogStyle = (selected) => selected ?
        "btn btn-primary small-button-spacer btn-block" : "btn btn-outline-primary small-button-spacer btn-block"

    const getLogRefreshStyle = (selected) => selected ?
        "btn btn-primary small-button-spacer btn-block" : "btn btn-outline-primary small-button-spacer btn-block"

    const getSelectedLineCount = (selected) => selected ?
        "btn btn-primary small-button-spacer btn-block" : "btn btn-outline-primary small-button-spacer btn-block"

    const setLogTypeLocal = (log_type) => dispatch(setLogType(log_type))
    const setNumLines = (num_lines) => dispatch(setNumLogLines(num_lines))
    const setLogRefresh = (time) => setLogRefreshState(time)
    const setLogServiceLocal = (log_service) => dispatch(setLogService(log_service))
    const applyFilter = () => getLogsLocal(log_type, log_service, log_lines, filter)

    const listToRender = filtered_list.length > 0 ? filtered_list : log_list

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4 px-5 pt-4">
                <div className="d-flex">
                    <div className="me-5 mb-3" style={{minWidth: "200px"}}>
                        <h6 className="small text-black-50">Select Service</h6>
                        <CustomSelect
                            label="Select Service"
                            defaultValue={log_service}
                            disabled={false}
                            onChange={(value) => setLogServiceLocal(value)}
                            options={service_list}
                            className="form-control"
                        />
                    </div>
                    <div className="me-5 mb-3">
                        <h6 className="small text-black-50">Search</h6>
                        <div className="input-group">
                            <input
                                onChange={(event) => setFilter(event.target.value)}
                                onKeyDown={check_keydown}
                                type="text"
                                placeholder={"Filter..."}
                                className="form-control filter-search-input"
                            />
                            <span className="input-group-text" onClick={applyFilter} style={{cursor: "pointer"}}>
                                <i title="apply filter" className="bi bi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="me-3 mb-3" title={"download logs for " + log_service + " service"}>
                        <h6 className="small text-black-50">{log_service + " log"}</h6>
                        <button
                            className="btn btn-primary text-nowrap"
                            onClick={() => download(log_service)}>Download
                        </button>
                    </div>
                    <div className="me-5 mb-3">
                        <h6 className="small text-black-50">Show Entries</h6>
                        <div className="btn-group">
                            <button title='last 50 lines'
                                    className={`${getSelectedLineCount(log_lines === 50)} btn text-nowrap`}
                                    onClick={() => setNumLines(50)}>50
                            </button>
                            <button title='last 100 lines'
                                    className={`${getSelectedLineCount(log_lines === 100)} btn text-nowrap`}
                                    onClick={() => setNumLines(100)}>100
                            </button>
                            <button title='last 250 lines'
                                    className={`${getSelectedLineCount(log_lines === 250)} btn text-nowrap`}
                                    onClick={() => setNumLines(250)}>250
                            </button>
                            <button title='last 500 lines'
                                    className={`${getSelectedLineCount(log_lines === 500)} btn text-nowrap`}
                                    onClick={() => setNumLines(500)}>500
                            </button>
                        </div>
                    </div>

                    <div className="me-5 mb-3">
                        <h6 className="small text-black-50">Type</h6>
                        <div className="btn-group">
                            <button title="display all log-types"
                                    className={`${getSelectedLogStyle(log_type === "All")} btn text-nowrap`}
                                    onClick={() => setLogTypeLocal("All")}>All
                            </button>
                            <button title="display only 'info' log-types"
                                    className={`${getSelectedLogStyle(log_type === "INFO")} btn text-nowrap`}
                                    onClick={() => setLogTypeLocal("INFO")}>Info
                            </button>
                            <button title="display only 'debug' log-types"
                                    className={`${getSelectedLogStyle(log_type === "DEBUG")} btn text-nowrap`}
                                    onClick={() => setLogTypeLocal("DEBUG")}>Debug
                            </button>
                            <button title="display only 'error' log-types"
                                    className={`${getSelectedLogStyle(log_type === "ERROR")} btn text-nowrap`}
                                    onClick={() => setLogTypeLocal("ERROR")}>Error
                            </button>
                            <button title="display only 'warning' log-types"
                                    className={`${getSelectedLogStyle(log_type === "WARN")} btn text-nowrap`}
                                    onClick={() => setLogTypeLocal("WARN")}>Warn
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <h6 className="small text-black-50">Refresh</h6>
                        <div className="btn-group">
                            <button title="do not automatically refresh the logs"
                                    className={`${getLogRefreshStyle(log_refresh === 0)} btn text-nowrap`}
                                    onClick={() => setLogRefresh(0)}>Off
                            </button>
                            <button title="automatically refresh this log every five seconds"
                                    className={`${getLogRefreshStyle(log_refresh === 5)} btn text-nowrap`}
                                    onClick={() => setLogRefresh(5)}>5 seconds
                            </button>
                            <button title="automatically refresh this log every 10 seconds"
                                    className={`${getLogRefreshStyle(log_refresh === 10)} btn text-nowrap`}
                                    onClick={() => setLogRefresh(10)}>10 seconds
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section flex-column flex-grow-1">
                <div className="log-list-overflow overflow-auto h-100 px-5 pb-4 d-flex flex-column">
                    <TransitionGroup>
                        {listToRender?.length > 0 &&
                            listToRender.slice().reverse().map((line, index) => {
                                return (
                                    <CSSTransition key={index} timeout={500} classNames="log-line">
                                        <div className="log-line py-3 d-flex flex-column text-break" id={line.created}>
                                            <div className="d-flex align-items-center mb-1">
                                                <span className={`me-2 log-type-width ${getClassForType(line.type)}`}>
                                                    {line.type}
                                                </span>
                                                <span className="me-2 text-black-50 small log-service-width text-truncate">
                                                    {line.service}
                                                </span>
                                                <span className="me-2 text-black-50 small log-time-width">
                                                    {Api.unixTimeConvert(line.created)}
                                                </span>
                                            </div>
                                            <p className="mb-0 text-break"
                                               dangerouslySetInnerHTML={
                                                   { __html: highlightText(line.message, filter) }
                                               }/>
                                        </div>
                                    </CSSTransition>
                                )
                            })}
                    </TransitionGroup>
                </div>
                <LogErrorDialog/>
            </div>
        </>
    )
}
