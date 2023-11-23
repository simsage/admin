import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getGroupList} from "./groupSlice";
import GroupList from "./GroupList";
import {GroupErrorDialog} from "./GroupErrorDialog";


export default function SynonymsHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session);
    const load_data = useSelector( (state) => state.groupReducer.data_status)

    useEffect(()=>{
        if (!session || !selected_organisation_id) return;
        dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[load_data === 'load_now', selected_organisation_id])


    return (
        <div className="">
            <GroupList />
            <GroupErrorDialog/>
        </div>
    )
}