import React from "react";

export function KnowledgeBaseFormTab({selected_tab, onTabChange}) {

    const tabs = [
        {slug: 'general', label: 'General'},
        {slug: 'index_schedule', label: 'Index Optimization Schedule'},
    ]

    return (
        <ul className="nav px-5">
            {
                tabs.map((item, index) => {
                    return (
                        <li key={index}
                            onClick={() => onTabChange(item.slug)}
                            className={
                                ((selected_tab === item.slug) ? "active" : "") + " nav-item px-5 pt-3 pb-2 no-select"}
                        >
                            {item.label}
                        </li>
                    )
                })
            }
        </ul>
    )
}