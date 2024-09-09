import React, {useEffect, useState} from "react";
import SubNav from "../../includes/sub-nav";
import KnowledgeBaseHome from "../knowledge_bases/KnowledgeBaseHome";
import LogHome from "./LogHome";
import {useDispatch, useSelector} from "react-redux";
import {OrganisationHome} from "../organisations/OrganisationHome";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import AlertDialogHome from "../alerts/AlertDialogHome";

export default function Home() {
    const isAdminUser = useSelector((state) => state.authReducer.is_admin)
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const [selected_sub_nav, setSelectedSubNav] = useState('org')
    const [is_admin, setIsAdmin] = useState(false)


    //Standard menu
    let sub_nav = []

    //menu options
    if (isAdminUser) {
        sub_nav.push({label: "Organisations", slug: "org"})
    }
    sub_nav.push({label: "Knowledge Bases", slug: "knowledge-bases"})
    if (isAdminUser) {
        sub_nav.push({label: "Logs", slug: "logs"})
    }

    useEffect(() => {
        // set the menu to org if we've just changed to being an
        // administrator, or we haven't set it yet
        if (selected_sub_nav === '' || (isAdminUser !== is_admin)) {
            if (isAdminUser) {
                setSelectedSubNav('org');
                setIsAdmin(true);
            } else {
                setSelectedSubNav('knowledge-bases');
                setIsAdmin(false);
            }
        }

    }, [isAdminUser, selected_sub_nav, setSelectedSubNav, is_admin, setIsAdmin]);


    function changeNav(slug) {

        setSelectedSubNav(slug);
        // load the knowledge-bases (get the list) if we click the knowledge-bases slug
        if (slug === "knowledge-bases") {
            if (session && session.id && organisation_id) {
                dispatch(getKBList({session_id: session.id, organization_id: organisation_id}));
            }
        }
    }

    return (
        <div className={""}>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav}/>
            </div>
            {selected_sub_nav === 'knowledge-bases' && <KnowledgeBaseHome/>}
            {selected_sub_nav === 'logs' && <LogHome/>}
            {selected_sub_nav === 'org' && <OrganisationHome/>}

            {/*<ErrorDialog />*/}
            <AlertDialogHome/>
        </div>
    );
}