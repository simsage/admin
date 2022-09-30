import {useDispatch, useSelector} from "react-redux";
import React, { useEffect } from "react";
import {loadSemantics} from "./semanticSlice";
import SemanticList from "./SemanticsList";


export default function SemanticsHome(props) {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.botReducer.data_status);
    const status = useSelector((state) => state.semanticReducer.status);

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);


    const semantic_list = useSelector((state) => state.semanticReducer.semantic_list);
    const num_semantics = useSelector((state) => state.semanticReducer.num_semantics);

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevWord": 1,
        "filter": "",
        "pageSize": 10
    };


    useEffect(() => {
        console.log('loading...', data)
        dispatch(loadSemantics({ session_id, data }));
    }, [load_data === 'load_now'])

    return (
        <div className="section px-5 pt-4">

            {/*show semantic list*/}
            {status !== null && semantic_list.length > 0 && num_semantics > 0 &&
                <SemanticList />
            }

        </div>
    )
}