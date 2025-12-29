import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {
    showAddOrganisationForm,
    showEditOrganisationForm
} from "../features/organisations/organisationSlice";
import {setSelectedOrganisation, simsageLogOut} from "../features/auth/authSlice";
import {getKBList} from "../features/knowledge_bases/knowledgeBaseSlice";
import {selectTab, toggleTheme} from "../features/home/homeSlice";
import {getGroupList} from "../features/groups/groupSlice";
import {useAuth} from "react-oidc-context";


/**
 * this is the main DMS page
 */

const AccountDropdown = () => {

    const dispatch = useDispatch();
    const auth = useAuth();

    const accounts_dropdown = useSelector((state) => state.authReducer.accounts_dropdown)
    const session = useSelector((state) => state.authReducer.session)
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);
    const organisation_list_status = useSelector((state) => state.organisationReducer.status);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const isAdminUser = useSelector((state) => state.authReducer.is_admin)
    const theme = useSelector((state) => state.homeReducer.theme)

    // menu selects a different organisation
    function handleSelectOrganisation(session_id, org) {
        if (session_id && org && org.id) {
            const org_id = org.id
            dispatch(setSelectedOrganisation(org));
            dispatch(getKBList({session_id: session_id, organization_id: org_id}));
            dispatch(getGroupList({session_id:session_id, organization_id:org_id, filter: null}))
            dispatch(selectTab('home'))
        }
    }

    function handleAddOrganisation(){
        dispatch(showAddOrganisationForm({show_form:true}))
    }

    function handleTheme(e) {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        dispatch(toggleTheme())
    }

    function handleEditOrganisation(org_id){
        dispatch(showEditOrganisationForm({show_form:true,org_id:org_id}))
    }


    function handleSignOut(){
        dispatch(simsageLogOut({session_id:session.id, auth: auth}))
    }

    function getOrganisationList(){
        let org_list = []

        if(isAdminUser) {
            org_list = organisation_list
        } else {
            org_list.push(selected_organisation)
        }
        return org_list;

    }

    // download the admin manual pdf
    function view_admin_manual() {
        window.open(process.env.PUBLIC_URL + "/resources/admin-manual.pdf", "blank");
    }

    return (
        <div className={(accounts_dropdown ? "d-flex" : "d-none") + (theme === "light" ? " account-dropdown" : " account-dropdown-dark")}>
            <ul className="acc-nav ps-0 mb-0">
                {organisation_list_status  !== "fulfilled" &&
                <li className={(theme === "light" ? "acc-item" : "acc-item-dark") + " px-4 py-3 d-flex justify-content-between"}>
                    <label className='fst-italic'>Organisations loading...</label>
                </li>
                }

                {organisation_list_status === "fulfilled" && organisation_list.length > 0 && selected_organisation &&
                    getOrganisationList().map((item ,i) => {
                        return(
                            // <div className={props.busy ? "dms wait-cursor" : "dms"} onClick={() => closeMenus()}>
                            <li key={i}
                                className={((item.id === selected_organisation.id)? "active" : "") + (theme === "light" ? " acc-item" : " acc-item-dark") + " px-4 py-2 d-flex justify-content-between align-items-center"}>
                                <span className="organisation-menu-item pointer-cursor" title={"select " + item.name} style={{"width": "90%", "padding": "10px"}}
                                      onClick={() => handleSelectOrganisation(session.id, item)}>{item.name}</span>
                                <span className="p-2 org-settings pointer-cursor" onClick={() => handleEditOrganisation(item.id)} title={"edit " + item.name}>
                                    <img src={theme==="light" ? "images/icon/icon_setting.svg" : "images/icon/icon_setting_dark.svg"}
                                     alt="edit"
                                     className={theme === "light" ? "sb-icon" : "sb-icon sb-icon-dark"}/>
                                </span>
                            </li>)
                    })
                }

                {isAdminUser &&
                <li className="px-3 py-3 pointer-cursor" onClick={() => handleAddOrganisation()}>
                    <span className='py-2 btn btn-outline-primary w-100'>
                    <label className="pointer-cursor fw-500" title="add a new organisation">+ Add Organisation</label>
                    </span>
                </li>
                }
                <li className="px-3 pointer-cursor" onClick={(e) => view_admin_manual(e)}>
                    <span className='py-2 btn w-100'>
                    <label className="pointer-cursor fw-500" title="Download Admin Manual">Download Admin Manual</label>
                    </span>
                </li>
                <li className="px-3 pb-3 pointer-cursor" onClick={(e) => handleTheme(e)}>
                    <span className='py-2 btn w-100'>
                    <label className="pointer-cursor fw-500" title="add a new organisation">{theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}</label>
                    </span>
                </li>

                <hr className="my-0" />
                <li className={(theme === "light" ? "acc-item" : "acc-item-dark") + " px-4 py-3 pointer-cursor fw-500"} title="Sign Out"
                    onClick={() => {
                        handleSignOut()
                    }}>
                    <label className="ps-4 pointer-cursor" title="Sign Out">Sign Out</label>
                </li>
                </ul>
            </div>
    );
}

export default AccountDropdown;
