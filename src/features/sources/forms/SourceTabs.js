import React, {useState} from "react";

export default function SourceTabs(props) {

    const [selected_tab, setSelectedTab] = useState("general")

    const source_tabs = [
        {label: "general", slug: "general"},
        {label: "rss crawler", slug: "rss-crawler"},
        {label: "metadata", slug: "metadata"},
        {label: "ACLs", slug: "acls"},
        {label: "schedule", slug: "schedule"},
    ]

    let is_active = false;

    function changeNav(slug){
        setSelectedTab(slug);
    }

    return (
        <ul className="nav nav-tabs">
            {
                source_tabs.map((item, index) => {
                    is_active = (selected_tab === item.slug) ? true : false;
                    return (<li key={index} className="nav-item nav-cursor" onClick={()=>changeNav(item.slug)}>
                        <div className={is_active?"nav-link active":"nav-link"}>{item.label}</div>
                    </li>)
                })
            }
        </ul>
    );
}