import React, { useState} from "react";
import SubNav from "../../includes/sub-nav";
import KnowledgeBaseHome from "../knowledge_bases/KnowledgeBaseHome";
import LogHome from "./LogHome";
import {useDispatch, useSelector} from "react-redux";
import {OrganisationHome} from "../organisations/OrganisationHome";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import AlertDialogHome from "../alerts/AlertDialogHome";

export default function Home() {
    const [selected_sub_nav, setSelectedSubNav] = useState('knowledge-bases')
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const sub_nav = [
        {label: "Knowledge Bases", slug:"knowledge-bases" },
        {label: "Logs", slug:"logs" },
        {label: "Organisations", slug:"org" },
    ]


    function changeNav(slug) {

        setSelectedSubNav(slug);
        // load the knowledge-bases (get the list) if we click the knowledge-bases slug
        if (slug === "knowledge-bases") {
            if (session && session.id && organisation_id) {
                dispatch(getKBList({session_id: session.id, organization_id: organisation_id}));
            }
        }
    }

    return(
        <div className={""}>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>

            {selected_sub_nav === 'knowledge-bases' &&
                <KnowledgeBaseHome />
            }
            {selected_sub_nav === 'logs' &&
                <LogHome />
            }
            {selected_sub_nav === 'org' &&
                <OrganisationHome />
            }

            {/*<ErrorDialog />*/}
            <AlertDialogHome />

        </div>
    );
}