import React, {useState} from "react";
import {setSelectedSourceTab} from "../sourceSlice";
import {useDispatch, useSelector} from "react-redux";

export default function SourceTabs(props) {

    const selected_tab = useSelector((state) => state.sourceReducer.selected_source_tab)

    return (
        <ul className="nav nav-tabs">
            {
                props.source_tabs.map((item, index) => {
                    // show core tabs [general, acls, schedules]
                    // show the crawler tab
                    // show the meta tab if crawler is not wordpress
                    if (item.type === 'core' ||
                        (item.type === 'optional' && item.slug === props.crawler_type) ||
                        (item.type === 'meta' && props.crawler_type !== 'wordpress')) {

                        return (
                            <li key={index} className="nav-item nav-cursor" onClick={() => props.onClick(item.slug)}>
                                <div className={(selected_tab === item.slug) ? "nav-link active" : "nav-link"}>{item.label}</div>
                            </li>)
                    }
                })
            }
        </ul>
    );
}
