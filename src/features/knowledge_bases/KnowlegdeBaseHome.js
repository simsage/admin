import AddNewKnowledgeBase from "./AddNewKnowledgeBase";
import {useState} from "react";
import NoKnowledgeBase from "./NoKnowledgeBase";

const knowledge_base_list = []

export default function (){

    return(
        <div className={""}>
            {(knowledge_base_list.length == 0) &&
                <NoKnowledgeBase />
            }
            <AddNewKnowledgeBase />

        </div>
    )
}