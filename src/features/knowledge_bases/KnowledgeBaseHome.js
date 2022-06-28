import React, {useEffect, useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import {getOrganisationList} from "../organisations/organisationSlice";
import {getKBList} from "./knowledgeBaseSlice";


export default function KnowledgeBaseHome(){

    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const dispatch = useDispatch();
    const session = useSelector((state)=>state.authReducer.session)
    const filter = null;
    const selected_organisation = useSelector((state)=>state.authReducer.selected_organisation)


    useEffect(() => {
        dispatch(getOrganisationList({session:session, filter:filter}))
        // if(selected_organisation && selected_organisation.id) {
        //     dispatch(getKBList({session:session, organisation:id}))
        // }
    }, [dispatch])

    return(

            <div className="section px-5 pt-4">
                {(kb_list) && (kb_list.length === 0) &&
                <KnowledgeBaseIntro/>
                }
                {kb_list.length > 0 &&
                    <KnowledgeBaseList />
                }
            </div>
    )
}