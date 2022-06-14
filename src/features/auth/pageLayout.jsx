
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButtion";
import {useDispatch, useSelector} from "react-redux";
import {acquireTokenSilent, login} from "./authSlice";
import Comms from "../../utilities/comms";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    //console.log("auth/PageLayout");

    // do we have a session object locally? if not - sign-in
    const {session, jwt} = useSelector((state)=>state.authReducer)
    const { instance, accounts } = useMsal();

    //console.log("login accounts",accounts);

    // if (!session || !session.id){
    //     console.log("login111 !session || !session.id",!session || !session.id);
    // }else{
    //     console.log("login session",session.id);
    // }


    if ((!session || !session.id) && accounts && accounts.length > 0){
        // console.log("login inside if");
        const request = {
            account: accounts[0]
        };


        if(jwt === null) {
            dispatch(acquireTokenSilent(request))
        }


        // instance.acquireTokenSilent(request).then((response) => {
        //     console.log("login acquireTokenSilent");
        //     Comms.http_get_jwt('/auth/admin/authenticate/msal', response.idToken,
        //                     (response2) => {
        //                     // dispatch(login(response2.data))
        //                     console.log("login success:",response2.data)
        //                         dispatch({type: 'SIGN_IN', data: response2.data});
        //                     },
        //                     (errStr) => {
        //                         console.error("login Error:");
        //
        //                     });
        //
        //
        // });
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