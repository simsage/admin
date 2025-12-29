import React from "react";
import {useSelector} from "react-redux";

export function OrganisationTab({selected_tab, onTabChange}){

    const theme = useSelector((state) => state.homeReducer.theme);

    const tabs = [
        {slug:'general', label:'General'},
        {slug:'sso', label:'Single sign-on'},
    ];

    return(
    <ul className="nav px-5">
        {
            tabs.map((item, index) => {
                    return (
                        <li key={index} onClick={() => onTabChange(item.slug)}
                            className={((selected_tab === item.slug) ? "active" : "") +
                                (theme === "light" ? " nav-item" : " nav-item-dark") +
                                " px-5 pt-3 pb-2 no-select"}>{item.label}
                        </li>)
            })
        }
    </ul>);
}
