import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";
import OrganisationEdit from "../features/organisations/OraganisationEdit";

function MainSection(){
    const {selected_tab} = useSelector((state)=>state.homeReducer)
    const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form);

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

        </div>
    )
}

export default MainSection;