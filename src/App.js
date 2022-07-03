import React from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useSelector, useDispatch} from "react-redux";
import {PageLayout} from "./features/auth/pageLayout";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import {closeAllMenus} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";



function App() {

    const dispatch = useDispatch();

    function localCloseAllMenus(){
        // console.log("closeAllMenus");
        //console.log("closeAllMenus");
        dispatch(closeAllMenus())
    }


    const busy = false;
    const {user, session } = useSelector((state) => state.authReducer)
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)

    const state = useSelector((state) => state )

    console.log("App session",session)
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
