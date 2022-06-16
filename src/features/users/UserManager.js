import React, {useState} from "react";
import {useSelector} from "react-redux";
import {UsersList} from "./UsersList";

export function UserManager(){

    const [selectedTab, setSelectedTab] = useState('users')
    const theme = null;

    return(
        <div className="">
            {/*breadcrumb start*/}
            <div className="border-bottom">
                <ul className="nav px-5">
                    <li onClick={() => setSelectedTab('users')} className="nav-item px-5 pt-3 pb-2 small no-select border-bottom border-3 border-primary">Users</li>
                     <li onClick={() => setSelectedTab('groups')} className="nav-item px-5 pt-3 pb-2 small no-select">Groups</li>
                </ul>
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