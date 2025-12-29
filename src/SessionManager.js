// src/components/SessionManager.js
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useDispatch } from 'react-redux';
import {setOrganisationList} from "./features/organisations/organisationSlice";
import {login, simsageSignIn} from "./features/auth/authSlice";

export function SessionManager({ children }) {
    const auth = useAuth();
    const dispatch = useDispatch(); // This works now!

    useEffect(() => {

        if (auth.isAuthenticated && auth.user && auth.user.access_token) {
            // When OIDC user is loaded, dispatch the sign-in action to Redux
            console.log('SimSage Signing in');
            dispatch(simsageSignIn({
                id_token: auth.user.access_token,
                on_success: (data) => {
                    dispatch(login(data));
                    dispatch(setOrganisationList(data));
                },
                on_fail: (err) => {
                    console.log("login failed", err);
                }
            }))
        }

    }, [auth.isAuthenticated, auth.user, dispatch]); // Dependency array

    return children;
}
