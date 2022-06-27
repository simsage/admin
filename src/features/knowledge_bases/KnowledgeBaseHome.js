import React, {useEffect, useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import {getOrganisationList} from "../organisations/organisationSlice";


export default function KnowledgeBaseHome(){

    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const dispatch = useDispatch();
    const session = useSelector((state)=>state.authReducer.session)
    const filter = null;

    // console.log(session)
    useEffect(() => {
        dispatch(getOrganisationList({session:session, filter:filter}))
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