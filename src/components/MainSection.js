import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";
import OrganisationEdit from "../features/organisations/OraganisationEdit";
import ErrorMessage from "../common/ErrorMessage";
import {closeError} from "../features/auth/authSlice";

function MainSection(){

    const dispatch = useDispatch();

    const {selected_tab} = useSelector((state)=>state.homeReducer)
    const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form);
    const {is_error, error_text, error_title} = useSelector((state) => state.authReducer);
    const error_obj = {code: error_title, message: error_text};

    function authErrorClose(error_obj) {
        if (error_obj && error_obj.message.indexOf('cannot sign-in') >= 0) {
            window.location = "/";
        } else {
            dispatch(closeError());
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

            { is_error &&
                <ErrorMessage error={error_obj} close={() => authErrorClose(error_obj)} />
            }

        </div>
    )
}

export default MainSection;