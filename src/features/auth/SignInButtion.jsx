import React from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";
import {Button} from "bootstrap";

function handleLogin(instance) {
    instance.loginRedirect(loginRequest).catch(e => {
        console.error(e)
    })
}

export const SignInButton = () => {
    const { instance } = useMsal()

    return (
        <button className="btn btn-primary" onClick={() => handleLogin(instance)}>
            Sign in using redirect
        </button>
    );
}
