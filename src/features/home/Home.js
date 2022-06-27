import React, {useState} from "react";
import SubNav from "../../includes/sub-nav";
import KnowledgeBaseHome from "../knowledge_bases/KnowledgeBaseHome";
import StatusHome from "./StatusHome";
import LogHome from "./LogHome";
import {useDispatch} from "react-redux";
import {getOrganisationList} from "../organisations/organisationSlice";

export default function Home() {
    const [selected_sub_nav, setSelectedSubNav] = useState('knowledge-bases')
    const dispatch = useDispatch();

    const sub_nav = [
        {label: "Knowledge Bases", slug:"knowledge-bases" },
        {label: "Status", slug:"status" },
        {label: "Logs", slug:"logs" },
    ]

    function changeNav(slug) {
        // console.log(slug)

        // switch(slug) {
        //     case "knowledge-bases":
        //         console.log("knowledge-bases");
        //         break;
        //
        //     case "status":
        //         console.log("status");
        //         break;
        //
        //     case "logs":
        //         console.log("logs");
        //         break;
        //
        //     default:
        //         console.log("knowledge-bases");
        // }

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
            </div>
    );
}