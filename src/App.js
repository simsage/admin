import React from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "react-oidc-context";
import {
    closeAllMenus
} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";


function App() {

    const dispatch = useDispatch();
    const auth = useAuth()

    const busy1 = useSelector((state) => state.kbReducer.busy)
    const busy2 = useSelector((state) => state.authReducer.busy)
    const busy3 = useSelector((state) => state.sourceReducer.busy)
    const busy4 = useSelector((state) => state.llmReducer.busy)
    const theme = useSelector((state) => state.homeReducer.theme)


    function localCloseAllMenus() {
        dispatch(closeAllMenus())
    }

    if (!auth.isAuthenticated) {
        return <div>loading...</div>;
    }

    const busy = busy1 || busy2 || busy3 || busy4;
    return (
        <div className={busy ? (theme === "light" ? "dms wait-cursor" : "dms-dark wait-cursor") :
            (theme === "light" ? "dms" : "dms-dark")} onClick={() => localCloseAllMenus()}
             data-bs-theme={theme === "light" ? "light" : "dark"}
        >
            <LeftNavbar/>
            <div className="outer">
                <Header/>
                <MainSection/>
            </div>
        </div>
    );
}

export default App;
