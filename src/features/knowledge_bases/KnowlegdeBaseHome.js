import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import {useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";

const knowledge_base_list = []

export default function (){

    return(
        <div className={""}>
            {(true) && (knowledge_base_list.length === 0) &&
                <KnowledgeBaseIntro />
            }
            <KnowledgeBaseEdit />

        </div>
    )
}