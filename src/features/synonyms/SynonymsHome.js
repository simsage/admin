import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSynonyms} from "./synonymSlice";
import SynonymIntro from "./SynonymIntro";
import SynonymList from "./SynonymList";

import {SynonymErrorDialog} from "./SynonymErrorDialog";

export default function SynonymsHome(props) {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const status = useSelector((state) => state.synonymReducer.status);
    const load_data = useSelector( (state) => state.synonymReducer.data_status)


    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": null,
        "filter": "",
        "pageSize": 10
    };

    useEffect(() => {
        dispatch(loadSynonyms({ session_id, data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_knowledge_base_id, session, props.tab, load_data === 'load_now'])


    return (
        <>
            {status === null && <SynonymIntro />}
            {/*Intro message when there are no bot items loaded*/}
            {status !== null && <SynonymList />}
            <SynonymErrorDialog/>
        </>
    )
}