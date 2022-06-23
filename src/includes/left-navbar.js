import {useDispatch, useSelector} from "react-redux";
import {selectTab} from "../features/home/DefaultSlice";
import React from "react";

export default function LeftNavbar(){

    // Todo:: add nav separator
    const nav1 = [
        {label: "Overview", slug:"home", logo:"../images/icon/icon_overview.svg", separator:true, sub:[] },
        {label: "User Management", slug:"user-management", logo:"../images/icon/icon_user_management.svg", separator:false, sub:[] },
        // {label: "Organisations", slug:"organisation", logo:"../images/icon/icon_user_management.svg", separator:false, sub:[] },
    ]

    const nav2 = [
        {label: "Document Management", slug:"document-management", logo:"../images/icon/icon_document_sources.svg", separator:false, sub:[] },
        {label: "The Mind", slug:"the-mind", logo:"../images/icon/icon_the_mind.svg", separator:false, sub:[] },
        {label: "Reports", slug:"reports", logo:"../images/icon/icon_reports.svg", separator:false, sub:[] }
    ]

    const kb_list = useSelector((state) => state.kbReducer.kb_list);

    return (
        <div className="sidebar no-select">
            <div className="sb-logo d-flex justify-content-center align-items-center">
                <img src="/images/brand/simsage-logo-no-strapline.svg" alt="" className="h-75" />
            </div>

            <ul className="sb-nav ps-0 h-100 border-end">
                {nav1.map((item,i) => {
                    return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo} />
                })}



                {(kb_list !== null && kb_list.length > 0) &&
                <>
                    <li className="px-3 py-2 border-top">
                    <select className="form-select sb-select px-3 py-2">
                        {kb_list.map((item,i) => {
                            return <option key={i} value={item.id}>{item.name}</option>
                        })}
                    </select>
                    </li>
                    {nav2.map((item,i) => {
                        return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo} />
                    })}
                </>
                }

             </ul>

            {/*    <li className="px-3 py-2 border-top">*/}
            {/*        <select className="form-select sb-select px-3 py-2">*/}
            {/*            {kb_list.map((item,i) => {*/}
            {/*            return <option key={i} value={item.id}>{item.name}</option>*/}
            {/*            })}*/}
            {/*        </select>*/}
            {/*    </li>*/}

            {/* <ul className="sb-nav ps-0">*/}
            {/*    {nav2.map((item,i) => {*/}
            {/*        return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo} />*/}
            {/*    })}*/}
            {/*</ul>*/}
        </div>
    )
}

export const LeftSidebarNavItem = (props) => {

    const logo = props.logo;
    const label = props.label;
    const slug = props.slug;

    const {selected_tab} = useSelector((state) => state.defaultApp)
    const is_active = (selected_tab === slug);

    const dispatch = useDispatch();

    return(
        <li key={slug} onClick={() => dispatch(selectTab(slug))}
            className={is_active?"sb-item d-flex align-items-center px-4 py-2 active":"sb-item d-flex align-items-center px-4 py-2"} >
            <img src={logo} alt="" className="me-2 sb-icon"/>
            <label>{label}</label>
        </li>
    )
}