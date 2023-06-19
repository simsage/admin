import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadCategorizations} from "./categorizationSlice";
import CategorizationList from "./CategorizationList";
import api from "../../common/api";

export default function CategorizationHome() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const page_size = api.initial_page_size;
    let prev_cat_label = null;

    let data = {
        session_id: session_id,
        organisation_id:selected_organisation_id,
        kb_id:selected_knowledge_base_id,
        prevCategorizationLabel: prev_cat_label,
        pageSize: page_size};

    useEffect(()=>{
        dispatch(loadCategorizations(data))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[load_data === "load_now",selected_knowledge_base_id])


    return (
        <div className="">
            <CategorizationList />
        </div>

    )
}
