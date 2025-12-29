import React, {useState} from "react";
import SubNav from "../../includes/sub-nav";
import SynonymsHome from "../synonyms/SynonymsHome";
import SemanticsHome from "../semantics/SemanticsHome";
import SynsetsHome from "../synsets/SynsetsHome";
import TextToSearchHome from "../text_to_search/TextToSearchHome";
import LLMHome from "../llms/LLMHome";

export default function MindHome(){
    const [selected_sub_nav, setSelectedSubNav] = useState('llm')

    const sub_nav = [
        {label: "LLM set up", slug:"llm" },
        {label: "Synonyms", slug:"synonyms" },
        {label: "Semantics", slug:"semantics" },
        {label: "Synsets", slug:"synsets" },
    ]

    function changeNav(slug){
        setSelectedSubNav(slug);
    }

    return(
        <>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>
            {selected_sub_nav === 'synonyms' && <SynonymsHome tab={selected_sub_nav} />}
            {selected_sub_nav === 'semantics' && <SemanticsHome tab={selected_sub_nav} />}
            {selected_sub_nav === 'synsets' && <SynsetsHome tab={selected_sub_nav} />}
            {selected_sub_nav === 'llm' && <LLMHome tab={selected_sub_nav} />}
            {selected_sub_nav === 'textToSearch' && <TextToSearchHome/>}
        </>
    )
}
