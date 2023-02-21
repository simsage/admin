import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadMindItems} from "./botSlice";
import BotIntro from "./BotIntro";
import BotList from "./BotList"

export default function BotHome() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state).authReducer.session;
    const session_id = session.id;
    const load_data = useSelector( (state) => state.botReducer.data_status)
    const status = useSelector((state) => state.botReducer.status)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const mind_item_list = useSelector((state) => state.botReducer.mind_item_list);
    const num_mind_items = useSelector((state) => state.botReducer.num_mind_items);

    let data = {
        filter: "",
        kbId: selected_knowledge_base_id,
        organisationId: selected_organisation_id,
        pageSize: 10,
        prevId: 0
    }

    useEffect(()=>{
            dispatch(loadMindItems({ session_id, data }))
    },[load_data === 'load_now', selected_knowledge_base_id])

    return (

        <div className="section px-5 pt-4">

            {status === null &&
                <BotIntro />

            }
            {/*Intro message when there are no bot items loaded*/}
            {status !== null && mind_item_list.length === 0 && num_mind_items == 0 &&
                <BotIntro />

            }
            {/*show bot list*/}
            {status !== null && mind_item_list.length > 0 && num_mind_items > 0 &&
                <BotList />
            }
        </div>
    )

}