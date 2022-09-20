import React, {useEffect} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import KnowledgeBaseDelete from "./KnowledgeBaseDelete";
import KnowledgeBaseDeleteInfo from "./KnowledgeBaseDeleteInfo";
import KnowledgeBaseOptimize from "./KnowledgeBaseOptimize";
import KnowledgeBaseViewIds from "./KnowledgeBaseViewIds";
import {getKBList} from "./knowledgeBaseSlice";
import {getOrganisationList} from "../organisations/organisationSlice";


export default function KnowledgeBaseHome() {


    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const status = useSelector((state) => state.kbReducer.status);
    const kb_show_form = useSelector((state) => state.kbReducer.show_form)
    const kb_show_delete_form = useSelector((state) => state.kbReducer.show_delete_form)
    const kb_show_delete_info_form = useSelector((state) => state.kbReducer.show_delete_info_form)
    const kb_show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const kb_view_id = useSelector((state) => state.kbReducer.view_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state).authReducer.session;
    const session_id = session.id;

    const load_data = useSelector((state) => state.kbReducer.data_status)
    const dispatch = useDispatch()


    useEffect(() => {
        console.log("load getKBList line 33", load_data)
        dispatch(getKBList({session_id: session_id, organization_id: organisation_id}));
    }, [load_data==='load_now', session_id, organisation_id])



    return (

        <div className="section px-5 pt-4">

            {status === null &&
                <KnowledgeBaseIntro/>
            }
            {/*Intro message when there is no kb list*/}
            {status !== null && kb_list !== {} && kb_list.length === 0 &&
                <KnowledgeBaseIntro/>
            }
            {/*show kb list*/}
            {status !== null && kb_list !== {} && kb_list.length > 0 &&
                <KnowledgeBaseList/>
            }
            {/*show kb add/edit form*/}
            {kb_show_form === true &&
                <KnowledgeBaseEdit/>
            }
            {kb_show_delete_form === true &&
                <KnowledgeBaseDelete />
            }
            {kb_show_delete_info_form === true &&
                <KnowledgeBaseDeleteInfo />
            }
            {/*show view list*/}
            { (kb_view_id !== null) &&
                <KnowledgeBaseViewIds />
            }
            {kb_show_optimize_form === true &&
                <KnowledgeBaseOptimize />
            }

        </div>
    )


}