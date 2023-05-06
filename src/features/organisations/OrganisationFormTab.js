import React from "react";

export function OrganisationTab({selected_tab, onTabChange}){

    const tabs = [
        {slug:'general', label:'General'},
        {slug:'sso', label:'Single Sign On'},
    ];

    return(
    <ul className="nav px-5">
        {
            tabs.map((item, index) => {
                    return (
                        <li key={index} onClick={() => onTabChange(item.slug)} className={((selected_tab === item.slug) ? "active" : "")+" nav-item px-5 pt-3 pb-2 no-select"}>{item.label}
                        </li>)
            })
        }
    </ul>);
}
