import React, {useState} from "react";
import SubNav from "../../includes/sub-nav";
import SourceHome from "../sources/SourceHome";
import InventoryHome from "../inventory/InventoryHome";
import DocumentStatsHome from "../stats/DocumentStatsHome";

export default function DocumentManagementHome(){
    const [selected_sub_nav, setSelectedSubNav] = useState('sources')

    const sub_nav = [
        {label: "Sources", slug: "sources" },
        {label: "Document Statistics", slug: "doc-stats" },
        {label: "Inventory", slug: "inventory" },
    ]

    function changeNav(slug){
        setSelectedSubNav(slug);
    }

    return(
        <div className={""}>
            <div className="border-bottom">
                <SubNav sub_nav={sub_nav} active_item={selected_sub_nav} onClick={changeNav} />
            </div>

            {selected_sub_nav === 'sources' &&
                <SourceHome tab={selected_sub_nav}/>
            }

            {selected_sub_nav === 'doc-stats' &&
                <DocumentStatsHome tab={selected_sub_nav}/>
            }

            {selected_sub_nav === 'inventory' &&
                <InventoryHome tab={selected_sub_nav}/>
            }
        </div>
    )
}
