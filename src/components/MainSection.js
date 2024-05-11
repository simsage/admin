import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";
import OrganisationEdit from "../features/organisations/OraganisationEdit";
import ErrorMessage from "../common/ErrorMessage";
import {closeError} from "../features/auth/authSlice";
import {clearOrgErrorMessage} from "../features/organisations/organisationSlice";
import {useKeycloak} from "@react-keycloak/web";
import {closeErrorMessage} from "../features/sources/sourceSlice";
import {clearDocErrorMessage} from "../features/document_management/documentSlice";

function MainSection(){

    const dispatch = useDispatch();
    const { keycloak } = useKeycloak();

    const selected_tab = useSelector((state)=>state.homeReducer.selected_tab)
    const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form);

    const {is_error, is_sign_in_error, error_text, error_title} = useSelector((state) => state.authReducer);
    const org_error_text = useSelector((state) => state.organisationReducer.error_message);
    const org_error_title = useSelector((state) => state.organisationReducer.error_title);
    const source_error_message = useSelector((state) => state.sourceReducer.error_message);
    const show_org_error_form = useSelector((state) => state.organisationReducer.show_error_form)
    const show_source_error = source_error_message && source_error_message.length > 0;
    const is_doc_error = useSelector((state) => state.documentReducer.is_error);
    const doc_error_text = useSelector((state) => state.documentReducer.error_text);

    const global_error_message = error_text ? error_text :
            (org_error_text ? org_error_text :
                (source_error_message ? source_error_message :
                (doc_error_text ? doc_error_text : '')));

    const global_error_title = error_title ? error_title :
        (org_error_title ? org_error_title : (source_error_message ? 'source error' : 'error'));
    const global_Show_error = is_error || show_org_error_form || show_source_error || is_doc_error;

    const error_obj = {code: global_error_title, message: global_error_message};

    function errorClose(error_obj) {
        if ((error_obj && error_obj.message && error_obj.message.indexOf('cannot sign-in') >= 0) ||
            is_sign_in_error) {
            keycloak.logout({redirectUri: window.location.protocol + "//" + window.location.host})
                .then( () => {
                    console.log("signed out");
                })
        } else {
            dispatch(closeError());
            dispatch(clearOrgErrorMessage());
            dispatch(clearDocErrorMessage());
            dispatch(closeErrorMessage());
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
                <ErrorMessage error={error_obj} close={() => errorClose(error_obj)} />
            }

        </div>
    )
}

export default MainSection;