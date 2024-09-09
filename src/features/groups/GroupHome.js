import React from "react";
import GroupList from "./GroupList";
import {GroupErrorDialog} from "./GroupErrorDialog";

export default function GroupHome() {

    return (
        <div className="">
            <GroupList />
            <GroupErrorDialog/>
        </div>
    )
}
