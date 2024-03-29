import {useDispatch, useSelector} from "react-redux";
import {selectTab} from "../features/home/homeSlice";
import React from "react";
import {setSelectedKB} from "../features/auth/authSlice";

export default function LeftNavbar() {

    const nav1 = [
        {label: "Overview", slug: "home", logo: "images/icon/icon_overview.svg", separator: true, sub: []},
        {
            label: "User Management",
            slug: "user-management",
            logo: "images/icon/icon_user_management.svg",
            separator: false,
            sub: []
        },
    ]

    const nav2 = [
        {
            label: "Document Management",
            slug: "document-management",
            logo: "images/icon/icon_document_sources.svg",
            separator: false,
            sub: []
        },
        {label: "The Mind", slug: "the-mind", logo: "images/icon/icon_the_mind.svg", separator: false, sub: []}
    ]

    const dispatch = useDispatch();

    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    let selected_kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);


    function handleSelectKB(e) {
        let kb_id = e.target.value;
        if (kb_id === '') {
            kb_id = undefined;
            dispatch(selectTab('home'))
        }
        let selected_kb = null;
        for (const kb of kb_list) {
            if (kb.kbId === kb_id) {
                selected_kb = kb;
                break;
            }
        }
        dispatch(setSelectedKB(selected_kb))

    }

    return (
        <div className="sidebar no-select">
            <div className="sb-logo d-flex justify-content-center align-items-center pointer-cursor"
                 title="SimSage Portal" onClick={() => window.location = "/"}>
                <img src="images/brand/simsage-logo-no-strapline.svg" alt="" className="h-75"/>
            </div>

            <ul className="sb-nav ps-0 h-100 border-end">
                {nav1.map((item, i) => {
                    return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo}/>
                })}


                {(kb_list !== {} && kb_list.length > 0) &&
                    <>
                        <li className="px-3 pt-3 pb-2 border-top">
                            <select id="kb-selector" value={selected_kb_id ? selected_kb_id : ""}
                                    className="form-select sb-select px-3 py-2" onChange={(e) => handleSelectKB(e)}>
                                <option value="">Select Knowledge Base</option>
                                {kb_list.map((item, i) => {
                                    return <option key={i} value={item.kbId}>{item.name}</option>
                                })}
                            </select>
                        </li>

                        {selected_kb_id &&
                            nav2.map((item, i) => {
                                return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug}
                                                           logo={item.logo}/>
                            })
                        }

                    </>
                }

            </ul>

        </div>
    )
}

export const LeftSidebarNavItem = (props) => {

    const logo = props.logo;
    const label = props.label;
    const slug = props.slug;

    const {selected_tab} = useSelector((state) => state.homeReducer)
    const is_active = (selected_tab === slug);

    const dispatch = useDispatch();

    return (
        <li key={slug} onClick={() => dispatch(selectTab(slug))}
            className={is_active ? "sb-item d-flex align-items-center px-4 py-3 active" : "sb-item d-flex align-items-center px-4 py-3"}>
            <img src={logo} alt="" className="me-2 sb-icon"/>
            <label>{label}</label>
        </li>
    )
}
