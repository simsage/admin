import React, {useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";


export default function KnowledgeBaseHome(){

    const kb_list = useSelector((state) => state.kbReducer.kb_list);

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