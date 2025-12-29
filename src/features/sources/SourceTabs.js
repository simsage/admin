import React from "react";
import {useSelector} from "react-redux";

export default function SourceTabs(props) {

    const selected_tab = props.selected_source_tab
    const theme = useSelector((state) => state.homeReducer.theme);
    const use_training = window.ENV.show_ai_training === true

    return (
        <ul className="nav px-1 fit-width">
            {
                props.source_tabs.map((item, index) => {
                    // show core tabs [general, ACLs, schedules]
                    // show the crawler tab
                    if (item.type === 'core' ||
                        (item.type === 'optional' && item.slug === props.crawler_type) ||
                        (item.type === 'external-crawler' && props.isExternal)
                    ) {
                        return (
                            <li key={index}
                                className={((selected_tab === item.slug) ? "active" : "") +
                                    (theme === "light" ? " nav-item" : " nav-item-dark") +
                                    (use_training ? " px-3" : " px-4") +
                                    " pt-3 pb-2 no-select text-capitalize"}
                                onClick={() => props.onClick(item.slug)}>
                                {item.label}
                            </li>
                        )
                    } else {
                        return <div key={index}/>
                    }
                })
            }
        </ul>
    );
}
