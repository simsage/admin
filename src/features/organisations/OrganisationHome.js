import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getOrganisationList, showAddOrganisationForm, showEditOrganisationForm} from "./organisationSlice";
import {setSelectedKB, setSelectedOrganisation} from "../auth/authSlice";
import {Pagination} from "../../common/pagination";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import {selectTab} from "../home/homeSlice";


export function OrganisationHome() {
    const theme = null
    const organisationReducer = useSelector((state) => state.organisationReducer)
    const organisation_list = organisationReducer.organisation_list
    const load_data = organisationReducer.load_data

    const session = useSelector((state) => state.authReducer.session)
    const dispatch = useDispatch();

    const filter = null;

    //pagination
    const [page, setPage] = useState(0);
    const [page_size, setPageSize] = useState(10);

    useEffect(() => {
        dispatch(getOrganisationList({session: session, filter: filter}))
    }, [load_data === 'load_data'])


    function handleSelectOrganisation(session_id, org) {
        const org_id = org.id
        dispatch(setSelectedOrganisation(org));
        dispatch(getKBList({session_id: session.id, organization_id: org_id}));
        dispatch(selectTab('home'))
    }

    function handleAddOrganisation() {
        dispatch(showAddOrganisationForm({show_form: true}))
    }

    function handleEditOrganisation(org_id) {
        dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    return (
        <div className="section px-5 pt-4">
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Organisation</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>

                    {organisation_list &&
                        organisation_list.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className="pt-3 px-4 pb-3"
                                        onClick={() => handleSelectOrganisation(session.id, item)}>
                                        {item.name}
                                    </td>
                                    <td>
                                        <button className={"btn btn-outline-primary"} onClick={() => handleEditOrganisation(item.id)}>Edit</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>

                <Pagination
                    rowsPerPageOptions={[5, 10, 25]}
                    theme={theme}
                    component="div"
                    count={organisation_list.length}
                    rowsPerPage={page_size}
                    page={page}
                    backIconButtonProps={{'aria-label': 'Previous Page',}}
                    nextIconButtonProps={{'aria-label': 'Next Page',}}
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(rows) => setPageSize(rows)}
                />

            </div>
        </div>);
}