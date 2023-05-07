import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSynonyms} from "./synonymSlice";
import SynonymIntro from "./SynonymIntro";
import SynonymList from "./SynonymList";

export default function SynonymsHome(props) {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const status = useSelector((state) => state.synonymReducer.status);
    const load_data = useSelector( (state) => state.synonymReducer.data_status)

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms)

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": null,
        "filter": "",
        "pageSize": 10
    };

    console.log("synonym_list",synonym_list)


    useEffect(() => {
        dispatch(loadSynonyms({ session_id, data }));
        console.log("useEffect load_data",load_data)

    }, [selected_knowledge_base_id, session, props.tab, load_data === 'load_now'])



    // console.log("useEffect out load_data",load_data)
    return (
        <div className="">

            {status === null &&
                <SynonymIntro />

            }
            {/*Intro message when there are no bot items loaded*/}
            {status !== null && synonym_list.length === 0 && num_synonyms === 0 &&
                <SynonymList />

            }
            {status !== null && synonym_list.length > 0 && num_synonyms > 0 &&
                <SynonymList />

            }
        </div>
    )
}