import React, {Component, useEffect} from 'react';

// import '../css/navbar/account-dropdown.css';
import {useDispatch, useSelector} from "react-redux";
import {useMsal} from "@azure/msal-react";
import {getOrganisationList, showAddOrganisationForm} from "../features/organisations/organisationSlice";
import {setSelectedOrganisation} from "../features/auth/authSlice";
import {getKBList} from "../features/knowledge_bases/knowledgeBaseSlice";
// import AccountDropdown from "../navbar/AccountDropdown";

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
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const filter = null;


    console.log("session",session)
    function selectOrganisation(session_id,org){
        dispatch(setSelectedOrganisation(org));
        dispatch(getKBList(session_id, org));
    }

    function addOrganisation(){
        dispatch(showAddOrganisationForm(true))
    }

    function editAccount(){
        console.log("editAccount")
        // alert(selected_tab);
        // dispatch({type: "SELECT_TAB", data:selected_org})
    }

    function getHelp(){
        console.log("getHelp")
        // alert(selected_tab);
        // dispatch({type: "SELECT_TAB", data:selected_org})
    }

    function signOut(){
        console.log("signOut")
        // Comms.http_delete('/auth/sign-out',
        //     () => {
        //         dispatch({type: SIGN_OUT});
        //         if (callback)
        //             callback();
        //     },
        //     (errStr) => {
        //         console.error(errStr);
        //         if (callback)
        //             callback();
        //     }
        // )
    }


    return (
        <div className={(accounts_dropdown ? "d-flex" : "d-none") + " account-dropdown"}>
            <ul className="acc-nav ps-0 mb-0">
                {organisation_list.length > 0 && selected_organisation &&
                organisation_list.map((item ,i) => {
                        return(
                            // <div className={props.busy ? "dms wait-cursor" : "dms"} onClick={() => closeMenus()}>
                            <li key={item.id}
                                className={(item.id === selected_organisation.id)? "acc-item px-4 py-3 d-flex justify-content-between active":"acc-item px-4 py-3 d-flex justify-content-between"}
                                onClick={() => selectOrganisation(session.id,item)}>
                            <label>{item.name}</label>
                                <img src="../images/icon/icon_setting.svg" alt="" className="me-2 sb-icon"/>
                            </li>)
                    })
                }

                <li className="acc-item px-4 py-3" onClick={() => addOrganisation()}>
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
                        instance.logoutRedirect({
                            postLogoutRedirectUri: "/",
                        });
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