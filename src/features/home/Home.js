import React, {useEffect, useState} from "react";
import SubNav from "../../includes/sub-nav";
import KnowledgeBaseHome from "../knowledge_bases/KnowledgeBaseHome";
import StatusHome from "../status/StatusHome";
import LogHome from "./LogHome";
import {useDispatch, useSelector} from "react-redux";
import {getOrganisationList} from "../organisations/organisationSlice";
import {OrganisationHome} from "../organisations/OrganisationHome";

export default function Home() {
    const [selected_sub_nav, setSelectedSubNav] = useState('knowledge-bases')
    const dispatch = useDispatch();

    const sub_nav = [
        {label: "Knowledge Bases", slug:"knowledge-bases" },
        {label: "Status", slug:"status" },
        {label: "Logs", slug:"logs" },
        {label: "Organisations", slug:"org" },
    ]


    function changeNav(slug) {
        setSelectedSubNav(slug);
    }

        return(
            <div className={""}>
                <div className="border-bottom">
                    <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
                </div>

                {selected_sub_nav === 'knowledge-bases' &&
                <KnowledgeBaseHome />
                }
                {selected_sub_nav === 'status' &&
                <StatusHome />
                }
                {selected_sub_nav === 'logs' &&
                <LogHome />
                }
                {selected_sub_nav === 'org' &&
                    <OrganisationHome />
                }
            </div>
    );
}