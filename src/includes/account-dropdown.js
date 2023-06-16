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
                    <label className='fst-italic'>Organisations loading...</label>
                </li>
                }

                {organisation_list_status === "fulfilled" && organisation_list.length > 0 && selected_organisation &&
                organisation_list.map((item ,i) => {
                        return(
                            // <div className={props.busy ? "dms wait-cursor" : "dms"} onClick={() => closeMenus()}>
                            <li key={item.id}
                                className={((item.id === selected_organisation.id)? "active" : "") + " acc-item px-4 py-2 d-flex justify-content-between align-items-center"}>
                                <span className="organisation-menu-item pointer-cursor" title={"select " + item.name} style={{"width": "90%", "padding": "10px"}}
                                      onClick={() => handleSelectOrganisation(session.id, item)}>{item.name}</span>
                                <span className="p-2 org-settings pointer-cursor" onClick={() => handleEditOrganisation(item.id)} title={"edit " + item.name}>
                                    <img src="images/icon/icon_setting.svg"
                                     alt="edit"
                                     className="sb-icon"/>
                                </span>
                            </li>)
                    })
                }


                <li className="px-3 py-3 pointer-cursor" onClick={() => handleAddOrganisation()}>
                    <span className='py-2 btn btn-outline-primary w-100'>
                    <label className="pointer-cursor fw-500" title="add a new organisation">+ Add Organisation</label>
                    </span>
                </li>

                <hr className="my-0" />
                <li className="acc-item px-4 py-3 pointer-cursor fw-500" title="Sign Out"
                    onClick={() => {
                        handleSignOut()
                    }}>
                    <label className="pointer-cursor" title="Sign Out">Sign Out</label>
                </li>
                </ul>
            </div>
    );
}

export default AccountDropdown;
