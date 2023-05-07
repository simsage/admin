import React from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useDispatch} from "react-redux";
import {PageLayout} from "./features/auth/pageLayout";
import {AuthenticatedTemplate} from "@azure/msal-react";
import {closeAllMenus} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";


function App() {

    const dispatch = useDispatch();

    function localCloseAllMenus() {
        dispatch(closeAllMenus())
    }

    const busy = false;
    // const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);
    // const status = useSelector((state) => state.organisationReducer.status);
    //
    // useEffect(() => {
    //     if (organisation_list === {}) {
    //         console.log("getOrganisationList in App")
    //         // dispatch(getOrganisationList({session,org_filter}))
    //         //    todo show error
    //         console.error("organisation_list is empty")
    //     }
    // }, [status])

    // console.log("App organisation_list",organisation_list)
    return (
        <PageLayout>
            <AuthenticatedTemplate>
                <div className={busy ? "dms wait-cursor" : "dms"} onClick={() => localCloseAllMenus()}>
                    <LeftNavbar/>
                    <div className="outer">
                        <Header/>
                        <MainSection/>
                    </div>
                </div>
            </AuthenticatedTemplate>
        </PageLayout>
    );
}

export default App;
