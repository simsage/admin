import React from "react";

export function KnowledgeBaseFormTab({selected_tab, onTabChange}){

    const tabs = [
        {slug:'general', label:'General'},
        {slug:'index_schedule', label:'Index Schedule'},
    ];

    return(
    <ul className="nav nav-tabs">
        {
            tabs.map((item, index) => {
                    return (
                        <li key={index} className="nav-item nav-cursor" onClick={() => onTabChange(item.slug)}>
                            <div className={(selected_tab === item.slug) ? "nav-link active" : "nav-link"}>{item.label}</div>
                        </li>)
            })
        }
    </ul>);
}