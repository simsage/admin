import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSemantics} from "./semanticSlice";
import SemanticList from "./SemanticsList";
import {SemanticErrorDialog} from "./SemanticErrorDialog";


export default function SemanticsHome() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector((state) => state.semanticReducer.data_status);

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);


    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevWord": 1,
        "filter": "",
        "pageSize": 10
    };


    useEffect(() => {
        dispatch(loadSemantics({session_id, data}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === 'load_now'])

    return (
        <div className="">

            <SemanticList/>

            <SemanticErrorDialog/>
        </div>
    )
}