import React from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import KnowledgeBaseDelete from "./KnowledgeBaseDelete";
import KnowledgeBaseDeleteInfo from "./KnowledgeBaseDeleteInfo";
import KnowledgeBaseOptimize from "./KnowledgeBaseOptimize";
import KnowledgeBaseViewIds from "./KnowledgeBaseViewIds";


export default function KnowledgeBaseHome() {


    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const status = useSelector((state) => state.kbReducer.status);
    const kb_show_form = useSelector((state) => state.kbReducer.show_form)
    const kb_show_delete_form = useSelector((state) => state.kbReducer.show_delete_form)
    const kb_show_delete_info_form = useSelector((state) => state.kbReducer.show_delete_info_form)
    const kb_show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const kb_view_id = useSelector((state) => state.kbReducer.view_id)

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