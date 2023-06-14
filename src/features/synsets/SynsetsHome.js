import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {loadSynsets} from "./synsetSlice";
import SynsetList from "./SynsetList";

export default function SynsetHome() {

    const dispatch = useDispatch()

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const status = useSelector((state) => state.synsetReducer.status);

    useEffect(() => {
        dispatch(loadSynsets({ session_id, organisation_id: selected_organisation_id, kb_id:selected_knowledge_base_id, page:0, filter:"", page_size:10 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="">
            {status !== null &&
                <SynsetList />
            }
        </div>
    )
}
