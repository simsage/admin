
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButton";
import {useDispatch, useSelector} from "react-redux";
import {login, showError} from "./authSlice";
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
        // console.log(" page layout 1");
        const request = {
            account: accounts[0]
        };

        instance.acquireTokenSilent(request).then((response) => {
            // dispatch(setJwt(response.idToken));
            const api_base = window.ENV.api_base;
            const url = api_base + '/auth/admin/authenticate/msal';
            axios.get(url,{
                headers: {"API-Version": window.ENV.api_version,
                          "Content-Type": "application/json",
                          "jwt": response.idToken,}
            })
                .then(function (response2) {
                    dispatch(login(response2.data));
                    const session = response2.data.session;
                    dispatch(setOrganisationList(response2.data))
                    dispatch(getKBList({session_id:session.id, organization_id:session.organisationId}));
                })
                .catch((error) => {
                    console.error("SimSage sign-in error:",error);
                    dispatch(showError({"message": "cannot sign-in: " + error.message, "title": "sign-in error"}));
                });

        });
    }




    return (
        <>
            <nav bg="primary" variant="dark">
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
