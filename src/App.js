import React from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useDispatch, useSelector} from "react-redux";
import {PageLayout} from "./features/auth/pageLayout";
import {closeAllMenus} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";


function App() {

    const dispatch = useDispatch();
    const busy1 = useSelector((state) => state.kbReducer.busy)
    const busy2 = useSelector((state) => state.authReducer.busy)

    function localCloseAllMenus() {
        dispatch(closeAllMenus())
    }

    const busy = busy1 || busy2;
    return (
        <PageLayout>
            <div className={busy ? "dms wait-cursor" : "dms"} onClick={() => localCloseAllMenus()}>
                <LeftNavbar/>
                <div className="outer">
                    <Header/>
                    <MainSection/>
                </div>
            </div>
        </PageLayout>
    );
}

export default App;
