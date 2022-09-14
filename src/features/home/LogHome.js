import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {getLogs, setLogHours, setLogType, setLogService} from "./homeSlice";

const service_list = [
    {"key": "All", "value": "All services"},
    {"key": "Auth", "value": "Auth service only"},
    {"key": "Conversion", "value": "Conversion service only"},
    {"key": "Crawler", "value": "Crawler service only"},
    {"key": "Document", "value": "Document service only"},
    {"key": "Discovery", "value": "Discovery service only"},
    {"key": "Index", "value": "Index service only"},
    {"key": "KB", "value": "Knowledge base service only"},
    {"key": "Language", "value": "Language service only"},
    {"key": "Mind", "value": "Mind service only"},
    {"key": "Operator", "value": "Operator service only"},
    {"key": "Search", "value": "Search service only"},
    {"key": "Stats", "value": "Stats service only"},
    {"key": "Web", "value": "Web/Cloud service only"},
];


export default function LogHome(){
    const title = "Logs";

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const log_type = useSelector((state) => state.homeReducer.log_type)
    const log_service = useSelector((state) => state.homeReducer.log_service)
    const log_hours = useSelector((state) => state.homeReducer.log_hours)
    const log_list = useSelector((state) => state.homeReducer.log_list);
    const [log_refresh, setRefresh] = useState(0);

    function getLogsLocal(log_type, log_service, log_hours) {
        if (session && session.id && organisation_id) {
            dispatch(getLogs({session_id: session.id, organisation_id, log_type, log_service, log_hours}));
        }
    }

    useEffect(()=> {
        getLogsLocal(log_type, log_service, log_hours)
    }, [])

    // convert a log-type to a css class for display purposes
    function getClassForType(type) {
        if (type === 'Debug') return "log-type-debug";
        else if (type === 'Info') return "log-type-info";
        else if (type === 'Error') return "log-type-error";
        else return "log-type-warn";
    }

    function getHourTitle(hours) {
        if (hours === 1) return "display logs from the current hour as shown above";
        else if (hours === 2) return "display logs for the last two hours from the time shown";
        else return "display logs for the last " + hours + " hours from the time shown";
    }

    function getSelectedHourStyle(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function getSelectedLogStyle(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function getLogRefreshStyle(selected) {
        if (selected) return "btn btn-primary small-button-spacer btn-block"
        else return "btn btn-outline-primary small-button-spacer btn-block";
    }

    function setHours(log_hours) {
        dispatch(setLogHours(log_hours));
        getLogsLocal(log_type, log_service, log_hours);
    }

    function setLogTypeLocal(log_type) {
        dispatch(setLogType(log_type));
        getLogsLocal(log_type, log_service, log_hours);
    }

    function setLogRefresh(time) {
        setRefresh(time);
    }

    function setLogServiceLocal(log_service) {
        dispatch(setLogService(log_service));
        getLogsLocal(log_type, log_service, log_hours);
    }


    return(
        <div className="section px-5 pt-4">
            <div className="logger-service-selector">
                <select className="form-select" onChange={(event) => setLogServiceLocal(event.target.value)} defaultValue={log_service}>
                    {
                        service_list.map((value) => {
                            return (<option key={value.key} value={value.key}>{value.value}</option>)
                        })
                    }
                </select>
            </div>
            <div>
                <span title={getHourTitle(1)} className={getSelectedHourStyle(log_hours === 1)}
                      onClick={() => setHours(1)}>this hour</span>
                <span title={getHourTitle(2)} className={getSelectedHourStyle(log_hours === 2)}
                      onClick={() => setHours(2)}>last 2 hours</span>
                <span title={getHourTitle(12)} className={getSelectedHourStyle(log_hours === 12)}
                      onClick={() => setHours(12)}>last 12 hours</span>
                <span title={getHourTitle(24)} className={getSelectedHourStyle(log_hours === 24)}
                      onClick={() => setHours(24)}>last 24 hours</span>

                <span className="log-spacer">&nbsp;</span>

                <span title="display all log-types" className={getSelectedLogStyle(log_type === "All")}
                      onClick={() => setLogTypeLocal("All")}>all</span>
                <span title="display only 'info' log-types"
                      className={getSelectedLogStyle(log_type === "Info")}
                      onClick={() => setLogTypeLocal("Info")}>info</span>
                <span title="display only 'debug' log-types"
                      className={getSelectedLogStyle(log_type === "Debug")}
                      onClick={() => setLogTypeLocal("Debug")}>debug</span>
                <span title="display only 'error' log-types"
                      className={getSelectedLogStyle(log_type === "Error")}
                      onClick={() => setLogTypeLocal("Error")}>error</span>
                <span title="display only 'warning' log-types"
                      className={getSelectedLogStyle(log_type === "Warn")}
                      onClick={() => setLogTypeLocal("Warn")}>warn</span>

                <span className="log-spacer">&nbsp;</span>

                <span title="do not automatically refresh the logs"
                      className={getLogRefreshStyle(log_refresh === 0)}
                      onClick={() => setLogRefresh(0)}>off</span>
                <span title="automatically refresh this log every five seconds"
                      className={getLogRefreshStyle(log_refresh === 5)}
                      onClick={() => setLogRefresh(5)}>5 seconds</span>
                <span title="automatically refresh this log every 10 seconds"
                      className={getLogRefreshStyle(log_refresh === 10)}
                      onClick={() => setLogRefresh(10)}>10 seconds</span>
            </div>
            <br />
            <div className="log-list-overflow">
            {
                log_list && log_list.map((line, j) => {
                    return (<div key={j} className="log-line" id={line.created}>
                                <span className={'log-type-width ' + getClassForType(line.type)}>{line.type}</span>
                                <span className='log-service-width'>{line.service}</span>
                                <span className='log-time-width'>{Api.unixTimeConvert(line.created)}</span>
                                <span>{line.message}</span>
                            </div>)
                })
            }
            </div>
        </div>
    )
}