import {useSelector} from "react-redux";
import React, {useState} from "react";
import {LeftSidebarNavItem} from "../../includes/left-navbar";
import SubNav from "../../includes/sub-nav";

export default function MindHome(){
    const title = "The Mind";
    const [selected_sub_nav, setSelectedSubNav] = useState('bot')

    const sub_nav = [
        {label: "Bot", slug:"bot" },
        {label: "Synonyms", slug:"synonyms" },
        {label: "Semantics", slug:"semantics" },
        {label: "Synsets", slug:"synsets" },
        {label: "Categorization", slug:"categorization" },
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