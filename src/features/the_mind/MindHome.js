import React, {useState} from "react";
import SubNav from "../../includes/sub-nav";
import BotHome from "../bot/BotHome";
import SynonymsHome from "../synonyms/SynonymsHome";
import SemanticsHome from "../semantics/SemanticsHome";
import SynsetsHome from "../synsets/SynsetsHome";
import CategorizationHome from "../categorization/CategorizationHome";
import TextToSearchHome from "../text_to_search/TextToSearchHome";

export default function MindHome(){
    const [selected_sub_nav, setSelectedSubNav] = useState('synonyms')

    const sub_nav = [
        {label: "Synonyms", slug:"synonyms" },
        {label: "Semantics", slug:"semantics" },
        {label: "Synsets", slug:"synsets" },
        {label: "Categorization", slug:"categorization" },
    ]


    function changeNav(slug){
        setSelectedSubNav(slug);
    }

    return(
        <div className={""}>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>
            {selected_sub_nav === 'bot' &&
                <BotHome tab={selected_sub_nav} />
            }
            {selected_sub_nav === 'synonyms' &&
                <SynonymsHome tab={selected_sub_nav} />
            }
            {selected_sub_nav === 'semantics' &&
                <SemanticsHome tab={selected_sub_nav} />
            }
            {selected_sub_nav === 'synsets' &&
                <SynsetsHome tab={selected_sub_nav} />
            }
            {selected_sub_nav === 'categorization' &&
                <CategorizationHome tab={selected_sub_nav} />
            }
            {selected_sub_nav === 'textToSearch' &&
                <TextToSearchHome/>
            }
        </div>
    )
}