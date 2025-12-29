import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import KnowledgeBaseDelete from "./KnowledgeBaseDelete";
import KnowledgeBaseOptimize from "./KnowledgeBaseOptimize";
import KnowledgeBaseViewIds from "./KnowledgeBaseViewIds";
import {getKBList} from "./knowledgeBaseSlice";
import KnowledgeBaseTruncateIndexes from "./KnowledgeBaseTruncateIndexes";
import {KnowledgeBaseErrorDialog} from "./KnowledgeBaseErrorDialog";


export default function KnowledgeBaseHome() {


    // const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const status = useSelector((state) => state.kbReducer.status);
    const kb_show_form = useSelector((state) => state.kbReducer.show_form)
    const kb_show_delete_form = useSelector((state) => state.kbReducer.show_delete_form)
    const kb_show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const kb_show_truncate_indexes_form = useSelector((state) => state.kbReducer.show_truncate_indexes_form)
    const kb_view_id = useSelector((state) => state.kbReducer.view_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = (session && session.id) ? session.id : "";

    const dispatch = useDispatch()


    useEffect(() => {
        if (organisation_id)
            dispatch(getKBList({session_id: session_id, organization_id: organisation_id}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organisation_id, status==='load_now', kb_show_form])



    return (
        <div className="section px-5 pt-4">
            <KnowledgeBaseList/>

            {/*show kb add/edit form*/}
            {kb_show_form === true && <KnowledgeBaseEdit/>}
            {kb_show_delete_form === true && <KnowledgeBaseDelete/>}

            {/*show view list*/}
            { (kb_view_id !== null) && <KnowledgeBaseViewIds/>}
            {kb_show_optimize_form === true && <KnowledgeBaseOptimize/>}
            {kb_show_truncate_indexes_form === true && <KnowledgeBaseTruncateIndexes/>}
            <KnowledgeBaseErrorDialog/>
        </div>
    )
}