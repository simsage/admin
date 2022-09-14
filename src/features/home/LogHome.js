import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Api from "../../common/api";
import {getLogs} from "./homeSlice";

export default function LogHome(){
    const title = "Logs";

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const log_type = useSelector((state) => state.homeReducer.log_type)
    const log_service = useSelector((state) => state.homeReducer.log_service)
    const log_hours = useSelector((state) => state.homeReducer.log_hours)
    const log_list = useSelector((state) => state.homeReducer.log_list);

    useEffect(()=> {
        if (session && session.id && organisation_id) {
            dispatch(getLogs({session_id: session.id, organisation_id, log_type, log_service, log_hours}));
        }
    }, [])

    // convert a log-type to a css class for display purposes
    function getClassForType(type) {
        if (type === 'Debug') return "log-type-debug";
        else if (type === 'Info') return "log-type-info";
        else if (type === 'Error') return "log-type-error";
        else return "log-type-warn";
    }


    return(
        <div className="section px-5 pt-4">
            <table>
                <tbody>
                {
                    log_list && log_list.map((line, j) => {
                        return (<tr key={j} className="log-line" id={line.created}><td>
                                    <span className={'log-type-width ' + getClassForType(line.type)}>{line.type}</span>
                                    <span className='log-service-width'>{line.service}</span>
                                    <span className='log-time-width'>{Api.unixTimeConvert(line.created)}</span>
                                    <span>{line.message}</span>
                                </td></tr>)
                    })
                }
                </tbody>
            </table>
        </div>
    )
}