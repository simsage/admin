import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {UserManagementHome} from "../features/users/UserManagementHome";
import MindHome from "../features/the_mind/MindHome";
import DocumentManagementHome from "../features/document_management/DocumentManagementHome";
import Home from "../features/home/Home";

function MainSection(){
    const {selected_tab} = useSelector((state)=>state.homeReducer)
    const session = useSelector((state)=>state.authReducer.session)
    const organisation_list = useSelector((state)=>state.organisationReducer.organisation_list)

    if(organisation_list === {}) {
        console.log("useEffect Main sesction organisation_list", organisation_list,"session",session)
    }

    useEffect(() => {
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

            {/*{ selected_tab === 'reports' &&*/}
            {/*    <ReportsHome />*/}
            {/*}*/}



        </div>
    )
}

export default MainSection;