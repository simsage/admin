import React, {useState} from "react";
import {setSelectedSourceTab} from "../sourceSlice";
import {useDispatch, useSelector} from "react-redux";

export default function SourceTabs(props) {

    const selected_tab = useSelector((state) => state.sourceReducer.selected_source_tab)
    let is_active = false;
    const dispatch = useDispatch();

    function changeNav(slug){
        dispatch(setSelectedSourceTab(slug));
    }

    return (
        <ul className="nav nav-tabs">
            {
                props.source_tabs.map((item, index) => {
                    is_active = (selected_tab === item.slug) ? true : false;
                    return (<li key={index} className="nav-item nav-cursor" onClick={()=>changeNav(item.slug)}>
                        <div className={is_active?"nav-link active":"nav-link"}>{item.label}</div>
                    </li>)
                })
            }
        </ul>
    );
}