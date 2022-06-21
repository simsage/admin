import React, {useState} from "react";
import {useSelector} from "react-redux";
import {UsersList} from "./UsersList";
import SubNav from "../../includes/sub-nav";

export function UserManager(){

    const theme = null;
    const [selected_sub_nav, setSelectedSubNav] = useState('users')

    const sub_nav = [
        {label: "Users", slug:"users" },
        {label: "Groups", slug:"groups" },
    ]

    function changeNav(slug){
        console.log(slug)
        setSelectedSubNav(slug);
    }

    return(
        <div className="">
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>
            {selected_sub_nav === 'users' &&
                <UsersList />
            }
            {selected_sub_nav === 'groups' &&
            <h1>Groups</h1>
            }

        </div>
    )
}