import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";
import OrganisationEdit from "../features/organisations/OraganisationEdit";
import ErrorMessage from "../common/ErrorMessage";
import {closeError} from "../features/auth/authSlice";
import {useMsal} from "@azure/msal-react";
import {clearOrgErrorMessage} from "../features/organisations/organisationSlice";

function MainSection(){

    const dispatch = useDispatch();

    const {selected_tab} = useSelector((state)=>state.homeReducer)
    const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form);

    const {is_error, error_text, error_title} = useSelector((state) => state.authReducer);
    const org_error_text = useSelector((state) => state.organisationReducer.error_message);
    const org_error_title = useSelector((state) => state.organisationReducer.error_title);

    const show_org_error_form = useSelector((state) => state.organisationReducer.show_error_form)

    const global_error_message = error_text ? error_text : (org_error_text ? org_error_text : '');
    const global_error_title = error_title ? error_title : (org_error_title ? org_error_title : '');
    const global_Show_error = is_error || show_org_error_form;

    const error_obj = {code: global_error_title, message: global_error_message};
    const {instance} = useMsal();

    function authErrorClose(error_obj) {
        if (error_obj && error_obj.message.indexOf('cannot sign-in') >= 0) {
            // window.location = "/";
            instance.logoutRedirect().catch(e => {
                console.error("MainSection: logoutRequest error", e);
            });
        } else {
            dispatch(closeError());
            dispatch(clearOrgErrorMessage());
        }
    }

    return(
        <div>
            {selected_tab === 'home' &&
                <Home/>
            }

            { selected_tab === 'user-management' &&
                <UserManagementHome />
            }

            { selected_tab === 'document-management' &&
                <DocumentManagementHome />
            }

            { selected_tab === 'the-mind' &&
                <MindHome />
            }

            {show_organisation_form &&
                <OrganisationEdit />
            }

            { global_Show_error &&
                <ErrorMessage error={error_obj} close={() => authErrorClose(error_obj)} />
            }

        </div>
    )
}

export default MainSection;