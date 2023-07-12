import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getGroupList} from "./groupSlice";
import GroupList from "./GroupList";
import GroupIntro from "./GroupIntro";
import {GroupErrorDialog} from "./GroupErrorDialog";


export default function SynonymsHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session);
    const status = useSelector((state) => state.groupReducer.status);
    const load_data = useSelector( (state) => state.groupReducer.data_status)

    const group_list = useSelector((state) => state.groupReducer.group_list)

    useEffect(()=>{
        dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[load_data === 'load_now', selected_organisation_id])


    return (
        <div className="">

            {status === null &&
                <GroupIntro />

            }
            {/*Intro message when there are no bot items loaded*/}
            {status !== null && group_list.length === 0 &&
                <GroupIntro />

            }
            {status !== null && group_list.length > 0 &&
                <GroupList />

            }

            <GroupErrorDialog/>
        </div>
    )
}