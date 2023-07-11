import React from "react";

function SubNav(props){
    let is_active = false;
    return <ul className="nav px-5">
        {props.sub_nav.map((item,i) => {
            is_active = (props.active_item === item.slug);
            //TODO:: show active menu
            return <li key={i} onClick={() => props.onClick(item.slug)}
                       className={((is_active)?"active":"")+" nav-item px-5 pt-3 pb-2 no-select"}>
                {item.label}
            </li>
        })}
    </ul>;
}

export default SubNav