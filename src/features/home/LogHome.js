import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {getLogs, setLogType, setLogService, setNumLogLines} from "./homeSlice";
import {LogErrorDialog} from "./LogErrorDialog";

const service_list = [
    {"key": "Auth", "value": "Auth service"},
    {"key": "Conv", "value": "Conversion service"},
    {"key": "Crawler", "value": "Crawler service"},
    {"key": "DataProject", "value": "Data Project service"},
    {"key": "Document", "value": "Document service"},
    {"key": "Discovery", "value": "Discovery service"},
    {"key": "Index", "value": "Index service"},
    {"key": "KB", "value": "Knowledge base service"},
    {"key": "Language", "value": "Language service"},
    {"key": "Search", "value": "Search service"},
    {"key": "Stats", "value": "Stats service"},
    {"key": "Cloud", "value": "Web/Cloud service"},
];


export default function LogHome(){
    // const title = "Logs";

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const log_type = useSelector((state) => state.homeReducer.log_type)
    const log_service = useSelector((state) => state.homeReducer.log_service)
    const log_lines = useSelector((state) => state.homeReducer.log_lines)
    const log_list = useSelector((state) => state.homeReducer.log_list);
    const [log_refresh, setRefresh] = useState(0);
    const lastItemRef = useRef();

    function getLogsLocal(log_type, log_service, log_lines) {
        if (session && session.id && organisation_id) {
            dispatch(getLogs({session_id: session.id, organisation_id, log_type, log_service, log_lines}));
        }
    }

    useEffect(()=> {
        getLogsLocal(log_type, log_service, log_lines)

        return function cleanup() {
            if (window.log_timer) {
                clearInterval(window.log_timer);
                window.log_timer = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // convert a log-type to a css class for display purposes
    function getClassForType(type) {
        if (type === 'DEBUG') return "log-type-debug";
        else if (type === 'INFO') return "log-type-info";
        else if (type === 'ERROR') return "log-type-error";
        else return "log-type-warn";
    }

    function getSelectedLogStyle(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function getLogRefreshStyle(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function getSelectedLineCount(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function setLogTypeLocal(log_type) {
        dispatch(setLogType(log_type));
        getLogsLocal(log_type, log_service, log_lines);
    }

    function setNumLines(num_lines) {
        dispatch(setNumLogLines(num_lines));
        getLogsLocal(log_type, log_service, log_lines);
    }

    function setLogRefresh(time) {
        setRefresh(time);

        // clear any existing timer
        if (window.log_timer) {
            clearInterval(window.log_timer);
            window.log_timer = null;
        }
        if (time > 0) {
            window.log_timer = setInterval(() => {
                getLogsLocal(log_type, log_service, log_lines);
            }, time * 1000);
        }
    }

    function setLogServiceLocal(log_service) {
        dispatch(setLogService(log_service));
        getLogsLocal(log_type, log_service, log_lines);
    }

    window.setTimeout(() => {
        if (lastItemRef && lastItemRef.current && lastItemRef.current.scrollIntoView)
            lastItemRef.current.scrollIntoView({ block: "end", behavior: "auto" })
    }, 100);

    return(
        <div className="section pt-4 d-flex flex-column">
            <div className="logger-service-selector d-flex align-items-end flex-wrap px-5">
                <div className="me-3">
                    <select className="form-select" onChange={(event) => setLogServiceLocal(event.target.value)} defaultValue={log_service}>
                        {
                            service_list.map((value) => {
                                return (<option key={value.key} value={value.key}>{value.value}</option>)
                            })
                        }
                    </select>
                </div>
                
                <div className="d-flex">
                    <div className="me-3">
                        <span className="small text-black-50">Top number of lines</span>
                        <br/>
                        <div className="btn-group">
                            <span title='last 100 lines' className={getSelectedLineCount(log_lines === 100) + " btn-sm text-nowrap"}
                                onClick={() => setNumLines(100)}>100</span>
                            <span title='last 250 lines' className={getSelectedLineCount(log_lines === 250) + " btn-sm text-nowrap"}
                                onClick={() => setNumLines(250)}>250</span>
                            <span title='last 500 lines' className={getSelectedLineCount(log_lines === 500) + " btn-sm text-nowrap"}
                                onClick={() => setNumLines(500)}>500</span>
                            <span title='all lines' className={getSelectedLineCount(log_lines === 0) + " btn-sm text-nowrap"}
                                onClick={() => setNumLines(0)}>All</span>
                        </div>
                    </div>

                    <div className="me-3">
                        <span className="small text-black-50">Type</span>
                        <br/>
                        <div className="btn-group">
                            <span title="display all log-types" className={getSelectedLogStyle(log_type === "All") + " btn-sm text-nowrap"}
                                onClick={() => setLogTypeLocal("All")}>All</span>
                            <span title="display only 'info' log-types"
                                className={getSelectedLogStyle(log_type === "INFO") + " btn-sm text-nowrap"}
                                onClick={() => setLogTypeLocal("INFO")}>Info</span>
                            <span title="display only 'debug' log-types"
                                className={getSelectedLogStyle(log_type === "DEBUG") + " btn-sm text-nowrap"}
                                onClick={() => setLogTypeLocal("DEBUG")}>Debug</span>
                            <span title="display only 'error' log-types"
                                className={getSelectedLogStyle(log_type === "ERROR") + " btn-sm text-nowrap"}
                                onClick={() => setLogTypeLocal("ERROR")}>Error</span>
                            <span title="display only 'warning' log-types"
                                className={getSelectedLogStyle(log_type === "WARN") + " btn-sm text-nowrap"}
                                onClick={() => setLogTypeLocal("WARN")}>Warn</span>
                        </div>
                    </div>

                    <div className="">
                        <span className="small text-black-50">Refresh</span>
                        <br/>
                        <div className="btn-group">
                            <button title="do not automatically refresh the logs"
                                className={getLogRefreshStyle(log_refresh === 0) + " btn-sm text-nowrap"}
                                onClick={() => setLogRefresh(0)}>off</button>
                            <span title="automatically refresh this log every five seconds"
                                className={getLogRefreshStyle(log_refresh === 5) + " btn-sm text-nowrap"}
                                onClick={() => setLogRefresh(5)}>5 seconds</span>
                            <span title="automatically refresh this log every 10 seconds"
                                className={getLogRefreshStyle(log_refresh === 10) + " btn-sm text-nowrap"}
                                onClick={() => setLogRefresh(10)}>10 seconds</span>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="log-list-overflow overflow-auto h-100 px-5 pb-4 d-flex flex-column">
                {
                    log_list?.length > 0 && log_list.map((line, j) => {
                        return (<div key={j} className="log-line py-2 border-bottom w-100 d-flex flex-column" id={line.created}>
                                    <div>
                                        <span className={'me-2 text-black-50 small log-type-width ' + getClassForType(line.type)}>{line.type}</span>
                                        <span className='me-2 text-black-50 small log-service-width'>{line.service}</span>
                                        <span className='me-2 text-black-50 small log-time-width'>{Api.unixTimeConvert(line.created)}</span>
                                    </div>
                                    <span className="">{line.message}</span>
                                </div>)
                    })
                }
                <div ref={lastItemRef}></div>
            </div>
            <LogErrorDialog/>
        </div>
    )
}