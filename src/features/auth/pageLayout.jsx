
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButtion";
import {useDispatch, useSelector} from "react-redux";
import {login} from "./authSlice";
import Comms from "../../utilities/comms";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    console.log("auth/PageLayout");

    // do we have a session object locally? if not - sign-in
    const {session} = useSelector((state)=>state.authReducer)
    const { instance, accounts } = useMsal();

    if (!session || !session.id){
        console.log("",!session || !session.id);
    }

    if ((!session || !session.id) && accounts && accounts.length > 0){
        // console.log(" inside if");
        const request = {
            account: accounts[0]
        };

        instance.acquireTokenSilent(request).then((response) => {

            Comms.http_get_jwt('/auth/admin/authenticate/msal', response.idToken,
                            (response2) => {
                                dispatch(login({type: 'SIGN_IN', data: response2.data}));
                            },
                            (errStr) => {
                                console.error("Error:");
                            });


        });
    }




    return (
        <>
            {props.children}
        </>
    );
};