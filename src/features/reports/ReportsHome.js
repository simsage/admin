import {useSelector} from "react-redux";
import React, {useState} from "react";
import {LeftSidebarNavItem} from "../../includes/left-navbar";
import SubNav from "../../includes/sub-nav";

export default function ReportsHome(){
    const title = "Report";
    const [selected_sub_nav, setSelectedSubNav] = useState('nav1')

    const sub_nav = [
        {label: "Nav 1", slug:"nav1" },
        {label: "Nav 2", slug:"nav2" },
        {label: "Nav 3", slug:"nav3" },
    ]

    function changeNav(slug){
        console.log(slug)
        setSelectedSubNav(slug);
    }

    return(
        <div className={""}>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>
            <div className="section px-5 pt-4">
                <h1>{title}</h1>
            </div>
        </div>
    )
}