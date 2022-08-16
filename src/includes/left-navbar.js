import {useDispatch, useSelector} from "react-redux";
import {selectTab} from "../features/home/homeSlice";
import React, {useEffect, useState} from "react";
import {setSelectedKB} from "../features/auth/authSlice";
import {getSources} from "../features/sources/sourceSlice";

export default function LeftNavbar(){

    // Todo:: add nav separator
    const nav1 = [
        {label: "Overview", slug:"home", logo:"../images/icon/icon_overview.svg", separator:true, sub:[] },
        {label: "User Management", slug:"user-management", logo:"../images/icon/icon_user_management.svg", separator:false, sub:[] },
        // {label: "Organisations", slug:"organisation", logo:"../images/icon/icon_user_management.svg", separator:false, sub:[] },
    ]

    const nav2 = [
        {label: "Document Management", slug:"document-management", logo:"../images/icon/icon_document_sources.svg", separator:false, sub:[] },
        {label: "The Mind", slug:"the-mind", logo:"../images/icon/icon_the_mind.svg", separator:false, sub:[] },
        {label: "Reports", slug:"reports", logo:"../images/icon/icon_reports.svg", separator:false, sub:[] }
    ]

    const dispatch = useDispatch();



    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const kb_list_status = useSelector((state) => state.kbReducer.status);
    const selected_tab = useSelector((state) => state.homeReducer.selected_tab);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    let selected_kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session);

    const [kb_option,setKBOption] = useState(kb_list);


    function handleSelectKB(e){
        let kb_id = e.target.value;
        if(kb_id === '') {
            kb_id = undefined;
            dispatch(selectTab('home'))
        }
        dispatch(setSelectedKB(kb_id))

        if(kb_id !== undefined){
            switch (selected_tab) {
                case "document-management" :
                    dispatch(getSources({session_id:session.id,organisation_id:selected_organisation_id,kb_id:kb_id}))
                    break;
            }
        }

    }

    useEffect(()=>{
        console.log("LeftSidebarNavItem Left Nav")
        selected_kb_id = "";
    },[selected_organisation_id])

    return (
        <div className="sidebar no-select">
            <div className="sb-logo d-flex justify-content-center align-items-center">
                <img src="/images/brand/simsage-logo-no-strapline.svg" alt="" className="h-75" />
            </div>

            <ul className="sb-nav ps-0 h-100 border-end">
                {nav1.map((item,i) => {
                    return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo} />
                })}



                {(kb_list !== {} && kb_list.length > 0) &&
                <>
                    <select value={selected_kb_id} className="form-select sb-select px-3 py-2" onChange={(e)=>handleSelectKB(e)}>
                        <option value="">Please select</option>
                        {kb_list.map((item,i) => {
                            return <option key={i} value={item.kbId}>{item.name}</option>
                        })}
                    </select>


                    {selected_kb_id !== null &&
                        nav2.map((item, i) => {
                            return <LeftSidebarNavItem key={i} label={item.label} slug={item.slug} logo={item.logo}/>
                        })
                    }

                </>
                }

             </ul>

        </div>
    )
}

export const LeftSidebarNavItem = (props) => {

    const logo = props.logo;
    const label = props.label;
    const slug = props.slug;

    const {selected_tab} = useSelector((state) => state.homeReducer)
    const is_active = (selected_tab === slug);

    const dispatch = useDispatch();

    return(
        <li key={slug} onClick={() => dispatch(selectTab(slug))}
            className={is_active?"sb-item d-flex align-items-center px-4 py-2 active":"sb-item d-flex align-items-center px-4 py-2"} >
            <img src={logo} alt="" className="me-2 sb-icon"/>
            <label>{label}</label>
        </li>
    )
}