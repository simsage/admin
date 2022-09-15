
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButtion";
import {useDispatch, useSelector} from "react-redux";
import {login, setJwt, simSageSignIn} from "./authSlice";
import Comms from "../../common/comms";
import axios from "axios";
import {getOrganisationList} from "../organisations/organisationSlice";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    const {session, jwt} = useSelector((state)=>state.authReducer)
    const { instance, accounts } = useMsal();


    if ((!session || !session.id) && accounts && accounts.length > 0){
        // console.log(" page layout 1");
        const request = {
            account: accounts[0]
        };

        instance.acquireTokenSilent(request).then((response) => {
            // dispatch(setJwt(response.idToken));
            const api_base = window.ENV.api_base;
            const url = '/auth/admin/authenticate/msal';
            const jwt = response.idToken;

            axios.get(api_base + url,{
                headers: {"API-Version": window.ENV.api_version, "Content-Type": "application/json", "jwt": response.idToken,}
            })
                .then(function (response2) {
                    dispatch(login(response2.data));
                    const session = response2.data.session;
                    const filter = null;
                    dispatch(getOrganisationList({session:session,filter:filter}));
                    dispatch(getKBList({session_id:session.id, organization_id:session.organisationId}));

                })
                .catch((error) => {
                    console.error("page layout error",error)
                });

        });
    }




    return (
        <>
            <nav bg="primary" variant="dark">
                { isAuthenticated ? <></> : <SignInButton /> }
            </nav>
            {props.children}
        </>
    );
};
