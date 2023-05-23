import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getGroupList} from "./groupSlice";
import GroupList from "./GroupList";
import GroupIntro from "./GroupIntro";


export default function SynonymsHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session);
    const status = useSelector((state) => state.groupReducer.status);
    const load_data = useSelector( (state) => state.groupReducer.data_status)

    const group_list = useSelector((state) => state.groupReducer.group_list)
    console.log('group_list...', group_list.length)
    console.log('status...', status)
    console.log(status !== null && group_list.length > 0 )


    useEffect(() => {
        if (load_data === 'load_now')
            dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
    }, [dispatch, load_data, selected_organisation_id, session.id])


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
        </div>
    )
}