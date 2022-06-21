import React, {useState} from "react";
import SubNav from "../../includes/sub-nav";
import {UsersList} from "../users/UsersList";
import KnowledgeBaseHome from "../knowledge_bases/KnowledgeBaseHome";

export default function Home() {
    const [selected_sub_nav, setSelectedSubNav] = useState('knowledge-bases')

    const sub_nav = [
        {label: "Knowledge Bases", slug:"knowledge-bases" },
        {label: "Status", slug:"status" },
        {label: "Logs", slug:"logs" },
    ]

    function changeNav(slug) {
        console.log(slug)
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
                <h1>status</h1>
                }
                {selected_sub_nav === 'logs' &&
                <h1>logs</h1>
                }
            </div>
    );
}