import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {UserManager} from "../features/users/UserManager";
import KnowlegdeBaseHome from "../features/knowledge_bases/KnowlegdeBaseHome";

function MainSection(){
    const {selected_tab} = useSelector((state)=>state.defaultApp)

    return(
        <div>
            {selected_tab === 'overview' &&
            <KnowlegdeBaseHome/>
            }

            { selected_tab === 'user-management' &&
            <UserManager />
            }

            { selected_tab === 'document-sources' &&
            <h1>document-sources</h1>
            }

            { selected_tab === 'the-mind' &&
            <h1>the mind</h1>
            }

            { selected_tab === 'reports' &&
            <h1>reports</h1>
            }
        </div>
    )
}

export default MainSection;