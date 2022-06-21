import {useSelector} from "react-redux";
import React, {useState} from "react";
import {LeftSidebarNavItem} from "../../includes/left-navbar";
import SubNav from "../../includes/sub-nav";

export default function DocumentManagementHome(){
    const title = "Document Management";
    const [selected_sub_nav, setSelectedSubNav] = useState('sources')

    const sub_nav = [
        {label: "Sources", slug:"sources" },
        {label: "Inventory", slug:"inventory" },
        {label: "Documents", slug:"documents" },
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