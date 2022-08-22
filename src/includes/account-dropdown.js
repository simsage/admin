import React, {Component, useEffect} from 'react';

import {useDispatch, useSelector} from "react-redux";
import {useMsal} from "@azure/msal-react";
import {
    getOrganisationList,
    showAddOrganisationForm,
    showEditOrganisationForm
} from "../features/organisations/organisationSlice";
import {setSelectedOrganisation} from "../features/auth/authSlice";
import {getKBList} from "../features/knowledge_bases/knowledgeBaseSlice";
import {selectTab} from "../features/home/homeSlice";

/**
 * this is the main DMS page
 */

const AccountDropdown = (props) => {

    const { instance } = useMsal();
    const dispatch = useDispatch();
    const state = useSelector((state) => state).authReducer;

    const accounts_dropdown = state.accounts_dropdown;
    const session = state.session;
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);
    const organisation_list_status = useSelector((state) => state.organisationReducer.status);

    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);

    const filter = null;

    function handleSelectOrganisation(session_id,org){
        const org_id = org.id
        dispatch(setSelectedOrganisation(org));
        dispatch(getKBList({session_id:session.id, organization_id:org_id}));
        dispatch(selectTab('home'))
    }

    // useEffect(()=>{
    //     dispatch(getOrganisationList({session:session, filter:null}))
    // },[organisation_list_status])

    function handleAddOrganisation(){
        dispatch(showAddOrganisationForm({show_form:true}))
    }

    function handleEditOrganisation(org_id){
        dispatch(showEditOrganisationForm({show_form:true,org_id:org_id}))
    }


    function editAccount(){
        console.log("edit Account")
    }

    function getHelp(){
        console.log("getHelp")
    }

    function handleSignOut(){
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
                                <label onClick={() => handleSelectOrganisation(session.id,item)}>{item.name}</label>
                                <img onClick={()=>handleEditOrganisation(item.id)} src="../images/icon/icon_setting.svg" alt="" className="me-2 sb-icon"/>
                            </li>)
                    })
                }


                <li className="acc-item px-4 py-3" onClick={() => handleAddOrganisation()}>
                    <label>+ Add New Organisation</label>
                </li>
<hr />

                {/*{window.ENV.use_experimental &&*/}
                <li className="acc-item px-4 py-3 " onClick={() => editAccount()}>
                    <label>Account</label>

                </li>
                <li className="acc-item px-4 py-3" onClick={() => getHelp()}>
                    <label>Help</label>
                </li>
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


// export default class AccountDropdown extends Component {
//     constructor(props){
//         super(props);
//         this.state={
//             has_error: false,  // error trapping
//             my_error_title: 'default error title',
//             my_error_message: 'default error message'
//         }
//     }
//     componentDidCatch(error, info) {
//         this.setState({ has_error: true });
//         console.log(error, info);
//     }
//     render() {
//         if (this.state.has_error) {
//             return <h1>account.js: Something went wrong.</h1>;
//         }
//         return (
//             <div className={(this.props.isAccountsDropdown ? "d-flex" : "d-none") + " account-dropdown"}>
//                 <ul className="acc-nav ps-0 mb-0">
//
//                     {window.ENV.use_experimental &&
//                     <li className="acc-item px-4 py-3" onClick={() => {if (this.props.onEditAccount) this.props.onEditAccount()}}>
//                         <label>Account</label>
//                     </li>
//                     }
//                     {/*<li className="acc-item px-4 py-3" onClick={() => {if (this.props.onSettingsModal) this.props.onSettingsModal()}}>*/}
//                     {/*    <label>Settings</label>*/}
//                     {/*</li>*/}
//                     <li className="acc-item px-4 py-3"
//                         onClick={() => {if (this.props.onSignOut) this.props.onSignOut()}}>
//                         <label>Sign Out</label>
//                     </li>
//                 </ul>
//             </div>
//         );
//     }
// }