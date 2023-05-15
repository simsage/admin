
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButtion";
import {useDispatch, useSelector} from "react-redux";
import {login, showError, simsageSignIn} from "./authSlice";
import axios from "axios";
import {setOrganisationList} from "../organisations/organisationSlice";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import ErrorMessage from "../../common/ErrorMessage";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    const {session, error_text, error_title} = useSelector((state)=>state.authReducer)
    const { instance, accounts } = useMsal();


    if ((!session || !session.id) && accounts && accounts.length > 0){

        const request = {
            account: accounts[0]
        };

        // actual SimSage/MSAL sign-in happens here
        instance.acquireTokenSilent(request).then((response) => {
            dispatch(simsageSignIn({id_token: response.idToken, on_success: (data) => {
                dispatch(login(data));
                dispatch(setOrganisationList(data))
            }, on_fail: (error_message) => {
                console.error("SimSage sign-in error:", error_message);
                dispatch(showError({"message": "cannot sign-in: " + error_message, "title": "sign-in error"}));
            }}));
        });
    }




    return (
        <>
            <nav>
                { isAuthenticated ? <></> : <SignInButton /> }
            </nav>
            { error_text && error_text.length > 1 &&
                <ErrorMessage error_text={error_text} error_title={error_title}
                          handleClose={() => {
                              instance.logoutRedirect().catch(e => {
                                  console.error("logoutRequest error", e);
                              });}}

                />
            }
            {props.children}
        </>
    );

};
