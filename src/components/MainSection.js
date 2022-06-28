import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import OrganisationEdit from "../features/organisations/OraganisationEdit";
import ReportsHome from "../features/reports/ReportsHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";
import {getOrganisationList} from "../features/organisations/organisationSlice";

function MainSection(){
    const {selected_tab} = useSelector((state)=>state.defaultApp)
    const session = useSelector((state)=>state.authReducer.session)
    const organisation_list = useSelector((state)=>state.organisationReducer.organisation_list)
    const filter = null;

    useEffect(() => {
        if(organisation_list && organisation_list.length==2) {
            console.log("useEffect Main sesction organisation_list")
        }

    }, [])

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

            { selected_tab === 'reports' &&
                <ReportsHome />
            }


            {/* Account dropdown*/}
            <OrganisationEdit />
        </div>
    )
}

export default MainSection;