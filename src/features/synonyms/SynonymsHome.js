import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSynonyms} from "./synonymSlice";
import SynonymIntro from "./SynonymIntro";
import SynonymList from "./SynonymList";

export default function SynonymsHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const status = useSelector((state) => state.synonymReducer.status);

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms)

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": null,
        "filter": "",
        "pageSize": 10
    };


    useEffect(() => {
        dispatch(loadSynonyms({ session_id, data }));
    }, [])


    return (
        <div className="section px-5 pt-4">

            {status === null &&
                <SynonymIntro />

            }
            {/*Intro message when there are no bot items loaded*/}
            {status !== null && synonym_list.length === 0 && num_synonyms == 0 &&
                <SynonymIntro />

            }
            {status !== null && synonym_list.length > 0 && num_synonyms > 0 &&
                <SynonymList />

            }
        </div>
    )
}