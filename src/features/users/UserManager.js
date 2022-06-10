import React, {useState} from "react";
import {useSelector} from "react-redux";
import {UsersList} from "./UsersList";

export function UserManager(){

    const [selectedTab, setSelectedTab] = useState('users')
    const theme = null;

    return(
        <div className="sec-toggled sec-not-toggled section">
            {/*breadcrumb start*/}
            <div className="sec-topbar py-2 px-12 d-flex justify-content-between align-items-center">
                <div className="sec-breadcrumb d-flex align-items-center small no-select">
                    <span onClick={() => setSelectedTab('users')} className={"px-2 py-1 mx-1 bc-link"}>Users</span>
                     <span onClick={() => setSelectedTab('groups')} className="px-2 py-1 mx-1 bc-link">Groups</span>
                </div>
            </div>

            {/*<br clear="both" />*/}
            {selectedTab === 'users' &&
                <UsersList />
            }
            {selectedTab === 'groups' &&
            <h1>Groups</h1>
            }

        </div>
    )
}