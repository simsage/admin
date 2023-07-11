import React, {useEffect} from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButton";
import {useDispatch, useSelector} from "react-redux";
import {login, showError, simsageSignIn} from "./authSlice";
import {setOrganisationList} from "../organisations/organisationSlice";
import ErrorMessage from "../../common/ErrorMessage";

// global variable - bad - but controls the process
let signing_in = false;


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    const {session, error_text, error_title} = useSelector((state) => state.authReducer)
    const {instance, accounts} = useMsal();

    // actual SimSage/MSAL sign-in happens here
    useEffect(() => {

        function sign_in(response) {
            if ((!session || !session.id) && !signing_in && response && response.idToken) {
                signing_in = true;
                dispatch(simsageSignIn({
                    id_token: response.idToken, on_success: (data) => {
                        dispatch(login(data));
                        dispatch(setOrganisationList(data))
                    }, on_fail: (error_message) => {
                        dispatch(showError({"message": "cannot sign-in: " + error_message, "title": "sign-in error"}));
                    }
                }));
            }
        }

        if (accounts && accounts.length > 0) {
            const request = {
                account: accounts[0]
            };
            instance.acquireTokenSilent(request).then((response) => {
                sign_in(response)
            });
        }

    }, [instance, accounts, dispatch, session])


    return (
        <>
            <nav>
                {isAuthenticated ? <></> : <SignInButton/>}
            </nav>
            {error_text && error_text.length > 1 &&
                <ErrorMessage error_text={error_text} error_title={error_title}
                              handleClose={() => {
                                  instance.logoutRedirect().catch(e => {
                                      console.error("logoutRequest error", e);
                                  });
                              }}

                />
            }
            {props.children}
        </>
    );

};
