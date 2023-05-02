import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {useMsal} from "@azure/msal-react";
import {
    showAddOrganisationForm,
    showEditOrganisationForm
} from "../features/organisations/organisationSlice";
import {setSelectedOrganisation, simsageLogOut} from "../features/auth/authSlice";
import {getKBList} from "../features/knowledge_bases/knowledgeBaseSlice";
import {selectTab} from "../features/home/homeSlice";

/**
 * this is the main DMS page
 */

const AccountDropdown = (props) => {

    const { instance } = useMsal();
    const dispatch = useDispatch();

    const accounts_dropdown = useSelector((state) => state.authReducer.accounts_dropdown)
    const session = useSelector((state) => state.authReducer.session)
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);
    const organisation_list_status = useSelector((state) => state.organisationReducer.status);

    console.log("session",session)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);


    // menu selects a different organisation
    function handleSelectOrganisation(session_id, org) {
        if (session_id && org && org.id) {
            const org_id = org.id
            dispatch(setSelectedOrganisation(org));
            dispatch(getKBList({session_id: session_id, organization_id: org_id}));
            dispatch(selectTab('home'))
        }
    }

    // useEffect(()=>{
    //     dispatch(getOrganisationList({session:session, filter:null}))
    // },[data_status === 'load_now'])

    function handleAddOrganisation(){
        dispatch(showAddOrganisationForm({show_form:true}))
    }

    function handleEditOrganisation(org_id){
        dispatch(showEditOrganisationForm({show_form:true,org_id:org_id}))
    }


    function handleSignOut(){
        dispatch(simsageLogOut({session_id:session.id}))
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }


    return (
        <div className={(accounts_dropdown ? "d-flex" : "d-none") + " account-dropdown"}>
            <ul className="acc-nav ps-0 mb-0">
                {organisation_list_status  !== "fulfilled" &&
                <li className="acc-item px-4 py-3 d-flex justify-content-between">
                    <label>organisations loading...</label>
                </li>
                }

                {organisation_list_status === "fulfilled" && organisation_list.length > 0 && selected_organisation &&
                organisation_list.map((item ,i) => {
                        return(
                            // <div className={props.busy ? "dms wait-cursor" : "dms"} onClick={() => closeMenus()}>
                            <li key={item.id}
                                className={(item.id === selected_organisation.id)? "acc-item px-4 py-3 d-flex justify-content-between active":"acc-item px-4 py-3 d-flex justify-content-between"}>
                                <span className="organisation-menu-item" onClick={() => handleSelectOrganisation(session.id, item)}>{item.name}</span>
                                <img onClick={() => handleEditOrganisation(item.id)} src="../images/icon/icon_setting.svg" alt="" className="me-2 sb-icon"/>
                            </li>)
                    })
                }


                <li className="acc-item px-4 py-3" onClick={() => handleAddOrganisation()}>
                    <label>+ Add New Organisation</label>
                </li>

                <hr />

                {/*{window.ENV.use_experimental &&*/}
                {/*<li className="acc-item px-4 py-3 " onClick={() => editAccount()}>*/}
                {/*    <label>Account</label>*/}

                {/*</li>*/}
                {/*<li className="acc-item px-4 py-3" onClick={() => getHelp()}>*/}
                {/*    <label>Help</label>*/}
                {/*</li>*/}
                <li className="acc-item px-4 py-3"
                    onClick={() => {
                        handleSignOut()
                    }}>
                    <label>Sign Out</label>
                </li>
                </ul>
            </div>
    );
}

export default AccountDropdown;
