import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadTextToSearch} from "./TextToSearchSlice";
import TextToSearchList from "./TextToSearchList";

const TextToSearchHome = () => {

        const dispatch = useDispatch();

        const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
        const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
        const session = useSelector((state) => state.authReducer.session)
        const session_id = session.id

        let data = {
            "filter": "",
            "kbId": selected_knowledge_base_id,
            "organisationId": selected_organisation_id,
            "pageSize": 10,
            "prevWord": ""
        };

        useEffect( () => {
            dispatch(loadTextToSearch({session_id, data}))
        }, [])
    return (
        <div>

            {/*{status === null &&*/}
            {/*<TextToSearchIntro/>*/}
            {/*}*/}

            {/*{status !== null && text_to_search_list.length === 0 && num_of_text_to_search === 0 &&*/}
            {/*<TextToSearchIntro/>*/}
            {/*}*/}

            {/*{status !== null && text_to_search_list.length > 0 && num_of_text_to_search > 0 &&*/}
            {/* <TextToSearchList/>*/}
            {/*}*/}

            <TextToSearchList/>
        </div>
    )
};

export default TextToSearchHome;