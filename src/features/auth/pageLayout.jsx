
import React from "react";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import {SignInButton} from "./SignInButtion";
import {useDispatch, useSelector} from "react-redux";
import {login, setJwt} from "./authSlice";
import Comms from "../../common/comms";
import axios from "axios";


/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    // console.log("auth/PageLayout");

    // do we have a session object locally? if not - sign-in
    const {session, jwt} = useSelector((state)=>state.authReducer)
    const { instance, accounts } = useMsal();


    // if (!session || !session.id){
    //     console.log("",!session || !session.id);
    // }

    if ((!session || !session.id) && accounts && accounts.length > 0){
        console.log(" page layout 1");
        const request = {
            account: accounts[0]
        };

        instance.acquireTokenSilent(request).then((response) => {
            console.log(" page layout 2");
            // dispatch(setJwt(response.idToken));
            const api_base = window.ENV.api_base;
            const url = '/auth/admin/authenticate/msal';


            axios.get(api_base + url,{
                headers: {"API-Version": window.ENV.api_version, "Content-Type": "application/json", "jwt": response.idToken,}
            })
                .then(function (response2) {
                   console.log("page layout response2",response2)
                })
                .catch((error) => {
                    console.error("page layout error",error)
                });

            // Comms.http_get_jwt('/auth/admin/authenticate/msal', response.idToken,
            //     (response2) => {
            //
            //         dispatch(login({type: 'SIGN_IN', data: response2.data}));
            //     },
            //     (errStr) => {
            //         console.error("Error:");
            //     }).then((res)=>{
            //         console.log(" page layout 3", res)
            //     }).catch((error) => {console.log("page layout error")});


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
