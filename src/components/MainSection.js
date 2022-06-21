import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {UserManager} from "../features/users/UserManager";
import OrganisationEdit from "../features/organisations/OraganisationEdit";
import ReportsHome from "../features/reports/ReportsHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";

function MainSection(){
    const {selected_tab} = useSelector((state)=>state.defaultApp)

    return(
        <div>
            {selected_tab === 'home' &&
                <Home/>
            }

            { selected_tab === 'user-management' &&
                <UserManager />
            }

            { selected_tab === 'document-management' &&
                <DocumentManagementHome />
            }

            { selected_tab === 'the-mind' &&
                <MindHome />
            }

            { selected_tab === 'reports' &&
                <ReportsHome />
            }


            {/* Account dropdown*/}
            <OrganisationEdit />
        </div>
    )
}

export default MainSection;