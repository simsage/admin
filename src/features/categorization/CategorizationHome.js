import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {loadCategorizations} from "./categorizationSlice";
import CategorizationIntro from "./CategorizationIntro";
import CategorizationList from "./CategorizationList";

export default function CategorizationHome(props) {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)
    const status = useSelector( (state) => state.categorizationReducer.status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const category_list = useSelector( (state) => state.categorizationReducer.category_list)


    useEffect(()=>{
        console.log('data...', session_id, selected_organisation_id, selected_knowledge_base_id)
        dispatch(loadCategorizations({session_id: session_id, organisation_id:selected_organisation_id,kb_id:selected_knowledge_base_id, prevCategorizationLabel:null,pageSize:5}))
    },[load_data === 'load_now'])

    return (
        <div className="section px-5 pt-4">

            {status === null &&
                <CategorizationIntro />
            }
            {status !== null && category_list.length === 0 &&
                <CategorizationIntro />
            }
            {status !== null && category_list.length > 0 &&
                <CategorizationList />
            }
        </div>

    )
}
