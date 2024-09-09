/*
 * Copyright (c) 2021 by Rock de Vocht
 *
 * All rights reserved. No part of this publication may be reproduced, distributed, or
 * transmitted in any form or by any means, including photocopying, recording, or other
 * electronic or mechanical methods, without the prior written permission of the publisher,
 * except in the case of brief quotations embodied in critical reviews and certain other
 * noncommercial uses permitted by copyright law.
 *
 */

import {useDispatch, useSelector} from "react-redux";
import {selectTab} from "../features/home/homeSlice";
import React from "react";
import {setSelectedKB} from "../features/auth/authSlice";
import CustomSelect from "../components/CustomSelect";

export default function LeftNavbar() {

    const dispatch = useDispatch();
    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    let selected_kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    const ICONS = {
        OVERVIEW:            "images/icon/icon_overview.svg",
        USER_MANAGEMENT:     "images/icon/icon_user_management.svg",
        DOCUMENT_SRC:        "images/icon/icon_document_sources.svg",
        MIND:                "images/icon/icon_the_mind.svg",
        SIMSAGE_LOGO:        "images/brand/simsage-logo-no-strapline.svg"
    }

    const nav1 = [
        {
            label: "Overview",
            slug: "home",
            logo: ICONS.OVERVIEW,
            separator: true,
            sub: []
        },
        {
            label: "User Management",
            slug: "user-management",
            logo: ICONS.USER_MANAGEMENT,
            separator: false,
            sub: []
        },
    ]

    const nav2 = [
        {
            label: "Document Management",
            slug: "document-management",
            logo: ICONS.DOCUMENT_SRC,
            separator: false,
            sub: []
        },
        {
            label: "The Mind",
            slug: "the-mind",
            logo: ICONS.MIND,
            separator: false,
            sub: []
        }
    ]


    function handleSelectKB(e) {
        const kb_id = e.target.value
        const selected_kb = kb_id ? kb_list.find(kb => kb.kbId === kb_id) : null
        dispatch(setSelectedKB(selected_kb))
        dispatch(selectTab(kb_id ? 'home' : ''))
    }


    return (
        <div className="sidebar no-select">
            <div className="sb-logo d-flex justify-content-center align-items-center pointer-cursor"
                 title="SimSage Portal" onClick={() => window.location = "/"}>
                <img src={ICONS.SIMSAGE_LOGO} alt="SimSage Logo" className="h-75" />
            </div>
            <ul className="sb-nav ps-0 h-100 border-end">
                {nav1.map((item) => (
                    <LeftSidebarNavItem key={item.slug} label={item.label} slug={item.slug} logo={item.logo}/>
                ))}

                {kb_list.length !== 0 && (
                    <>
                        <div className="px-3 pt-3 pb-2 border-top">
                            <CustomSelect
                                defaultValue={selected_kb_id || ""}
                                disabled={false}
                                onChange={(value) => handleSelectKB({ target: { value } })}
                                options={[{key: "", value: "Select Knowledge Base"}, ...kb_list.map(item => ({ key: item.kbId, value: item.name }))]}
                                label="Select Knowledge Base"
                            />
                        </div>

                        {selected_kb_id && nav2.map((item) => (
                            <LeftSidebarNavItem key={item.slug} label={item.label} slug={item.slug} logo={item.logo} />
                        ))}
                    </>
                )}
            </ul>
        </div>
    )
}


export const LeftSidebarNavItem = ({ logo, label, slug }) => {

    const selected_tab = useSelector((state) => state.homeReducer)
    const is_active = selected_tab === slug
    const dispatch = useDispatch()
    const handleClick = () => dispatch(selectTab(slug))

    return (
        <li onClick={handleClick}
            className={`sb-item d-flex align-items-center px-4 py-3 ${is_active ? 'active' : ''}`}>
            <img src={logo} alt="" className="me-2 sb-icon" />
            <label>{label}</label>
        </li>
    )
}

LeftSidebarNavItem.defaultProps = {
    logo: '',
    label: '',
    slug: ''
}
