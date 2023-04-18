import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadCategorizations} from "./categorizationSlice";
import CategorizationIntro from "./CategorizationIntro";
import CategorizationList from "./CategorizationList";

export default function CategorizationHome() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)
    const status = useSelector( (state) => state.categorizationReducer.status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const category_list = useSelector((state) => state.categorizationReducer.category_list);
    const total_count = useSelector((state) => state.categorizationReducer.total_count);
    const [page_size,setPageSize] = useState(useSelector((state)=>state.categorizationReducer.page_size))
    const [page,setPage] = useState(useSelector((state)=>state.categorizationReducer.page))

    let prev_cat_label = null;

    // useEffect(()=>{
    //     // console.log('data...', session_id, selected_organisation_id, selected_knowledge_base_id)
    //     dispatch(loadCategorizations({session_id: session_id, organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id, prevCategorizationLabel: prev_cat_label, pageSize: page_size}))
    // },[load_data === 'load_now'])

    let data = {
        session_id: session_id,
        organisation_id:selected_organisation_id,
        kb_id:selected_knowledge_base_id,
        prevCategorizationLabel: prev_cat_label,
        pageSize: page_size};

    useEffect(()=>{
        // console.log("category_list",load_data)
        dispatch(loadCategorizations(data))
    },[load_data === "load_now",selected_knowledge_base_id])


    return (
        <div className="">
            {/*{console.log("category_list",category_list)}*/}
            {/*{status === null &&*/}
            {/*    <CategorizationIntro />*/}
            {/*}*/}
            {/*{status !== null && category_list.length === 0 &&*/}
            {/*    <CategorizationIntro />*/}
            {/*}*/}
            {/*{status !== null && category_list.length > 0 &&*/}
            {/*    <CategorizationList />*/}
            {/*}*/}
            <CategorizationList />
        </div>

    )
}
