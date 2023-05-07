import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSimSageStatus} from "./statusSlice";
import Api from "../../common/api";

export default function StatusHome() {

    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state).authReducer.session;
    const session_id = session.id;
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getSimSageStatus({session_id:session_id,organisation_id:organisation_id}))
    },[])

    const status_list = useSelector((state) => state.statusReducer.status_list)


    const title = "Status";

    console.log("status_list",status_list)
    return (
        <div className="section px-5 pt-4">

            <div className="status-page">
                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <th className='table-header'>node</th>
                            <th className='table-header'>service</th>
                            <th className='table-header'>description</th>
                            <th className='table-header'>free memory</th>
                        </tr>
                        </thead>
                        <tbody>
                        { status_list.length > 0 &&
                            status_list.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            <div>{item.hostname}</div>
                                        </td>
                                        <td>
                                            <div>{item.service}</div>
                                        </td>
                                        <td>
                                            <div>{item.description}</div>
                                        </td>
                                        <td>
                                            <div>{Api.formatSizeUnits(item.memoryFreeInBytes ? item.memoryFreeInBytes : 0)}</div>
                                        </td>
                                    </tr>)
                            })
                        }
                        {status_list.length === 0 &&
                            <>no matching results found...</>
                        }

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}