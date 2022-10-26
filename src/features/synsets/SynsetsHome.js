import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSynsets} from "./synsetSlice";
import SynsetIntro from "./SynsetIntro";
import SynsetList from "./SynsetList";

export default function SynsetHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const status = useSelector((state) => state.synsetReducer.status);

    const synset_list = useSelector((state)=>state.synsetReducer.synset_list)
    const num_synsets = useSelector((state)=>state.synsetReducer.synset_total_size)

    let data = {
        "organisation_id": selected_organisation_id,
        "kb_id": selected_knowledge_base_id,
        "page": 0,
        "filter": "",
        "page_size": 10
    };


    useEffect(() => {
        dispatch(loadSynsets({ session_id, organisation_id: selected_organisation_id, kb_id:selected_knowledge_base_id, page:0, filter:"", page_size:10 }));
    }, [])


    return (
        <div className="section px-5 pt-4">

            {status === null &&
                <SynsetIntro />

            }
            {/*Intro message when there are no synsets items loaded*/}
            {status !== null && synset_list.length === 0 && num_synsets == 0 &&
                <SynsetIntro />

            }
            {status !== null && synset_list.length > 0 && num_synsets > 0 &&
                <SynsetList />

            }
        </div>
    )
}