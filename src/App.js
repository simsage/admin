import React, {useEffect} from 'react';

import LeftNavbar from "./includes/left-navbar";
import Header from "./includes/header";
import {useDispatch, useSelector} from "react-redux";
import {
    closeAllMenus, login,
    simsageSignIn,
} from "./features/auth/authSlice";
import MainSection from "./components/MainSection";
import {useKeycloak} from "@react-keycloak/web";
import {setOrganisationList} from "./features/organisations/organisationSlice";


function App() {

    const dispatch = useDispatch();
    const busy1 = useSelector((state) => state.kbReducer.busy)
    const busy2 = useSelector((state) => state.authReducer.busy)
    const busy3 = useSelector((state) => state.sourceReducer.busy)
    const busy4 = useSelector((state) => state.llmReducer.busy)

    const {initialized, keycloak} = useKeycloak()

    useEffect(() => {

        const loginToSimSage = () => {
            if (keycloak?.idToken) {
                dispatch(simsageSignIn({
                    id_token: keycloak.idToken,
                    on_success: (data) => {
                        dispatch(login(data));
                        dispatch(setOrganisationList(data));
                    },
                    on_fail: (err) => {
                        console.log("login failed", err);
                    }
                }))
            }
        }

        if (initialized) {

            keycloak.onAuthSuccess = () => {
                loginToSimSage()
            }

            keycloak.onAuthRefreshSuccess = () => {
                loginToSimSage()
            }

            keycloak.updateToken(5).then(function (refreshed) {
                if (refreshed) {
                    console.log('Token was successfully refreshed');
                } else {
                    console.log('Token is still valid');
                }
                loginToSimSage()

            }).catch(function (ex) {
                console.warn('Failed to refresh the token, or the session has expired', ex);
                keycloak.login();
                //window.location.reload();
            });
        }
    }, [initialized, keycloak, dispatch]);


    function localCloseAllMenus() {
        dispatch(closeAllMenus())
    }

    if (!initialized) {
        return <div>loading...</div>;
    }

    const busy = busy1 || busy2 || busy3 || busy4;
    return (
        <div className={busy ? "dms wait-cursor" : "dms"} onClick={() => localCloseAllMenus()}>
            <LeftNavbar/>
            <div className="outer">
                <Header/>
                <MainSection/>
            </div>
        </div>
    );
}

export default App;
