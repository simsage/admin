import React, {useState} from "react";
import {UsersHome} from "./UsersHome";
import SubNav from "../../includes/sub-nav";
import GroupHome from "../groups/GroupHome";
import {useSelector} from "react-redux";

export function UserManagementHome(){

    const [selected_sub_nav, setSelectedSubNav] = useState('users')
    const isUserAdmin= useSelector((state) => state.authReducer.is_admin)


    let sub_nav = [
        {label: "Users", slug:"users" },
    ]
    if(isUserAdmin){
        sub_nav.push({label: "Groups", slug:"groups" })
    }

    function changeNav(slug){
        setSelectedSubNav(slug);
    }

    return(
        <div className="">
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>
            {selected_sub_nav === 'users' &&
                <UsersHome />
            }
            {selected_sub_nav === 'groups' &&
                <GroupHome />
            }

        </div>
    )
}