import React from "react";
// import {setSelectedSourceTab} from "./sourceSlice";
// import {useDispatch, useSelector} from "react-redux";

export default function SourceTabs(props) {

    const selected_tab = props.selected_source_tab

    return (
        <ul className="nav px-5">
            {
                props.source_tabs.map((item, index) => {
                    // show core tabs [general, acls, schedules]
                    // show the crawler tab
                    if (item.type === 'core' || (item.type === 'optional' && item.slug === props.crawler_type))
                    {

                        return (
                            <li key={index} className={((selected_tab === item.slug) ? "active" : "")+" nav-item px-5 pt-3 pb-2 no-select text-capitalize"} onClick={() => props.onClick(item.slug)}>
                                {item.label}
                            </li>)
                    } else {
                        return (<div />)
                    }
                })
            }
        </ul>
    );
}
