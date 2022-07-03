import React, {useEffect} from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useSelector, useDispatch} from "react-redux";
import {PageLayout} from "./features/auth/pageLayout";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import {closeAllMenus} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";
import {getOrganisationList} from "./features/organisations/organisationSlice";



function App() {

    const dispatch = useDispatch();

    function localCloseAllMenus(){
        // console.log("closeAllMenus");
        //console.log("closeAllMenus");
        dispatch(closeAllMenus())
    }

    const busy = false;
    const {user, session } = useSelector((state) => state.authReducer)

    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);
    const organisation_list_status = useSelector((state) => state.organisationReducer.status);

    const org_filter = null;

    useEffect(()=>{
        if(organisation_list === undefined){
            dispatch(getOrganisationList({session,org_filter}))
        }
    },[])

    console.log("App organisation_list",organisation_list)
    return (
        <PageLayout>
          <AuthenticatedTemplate>
                <div className={busy ? "dms wait-cursor" : "dms"} onClick={() => localCloseAllMenus()}>
                    <LeftNavbar />
                    <div className="outer">
                        <Header />
                        <MainSection />
                    </div>
                </div>
          </AuthenticatedTemplate>

        </PageLayout>
    );
}

export default App;
