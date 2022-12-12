import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getOrganisationList, showAddOrganisationForm, showEditOrganisationForm} from "./organisationSlice";
import {setSelectedKB, setSelectedOrganisation} from "../auth/authSlice";
import {Pagination} from "../../common/pagination";
import {getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import {selectTab} from "../home/homeSlice";


export function OrganisationHome() {
    const theme = null
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const load_data = useSelector((state) => state.organisationReducer.data_status)

    const session = useSelector((state) => state.authReducer.session)
    const dispatch = useDispatch();

    const filter = null;

    //pagination
    const [page, setPage] = useState(0);
    const [page_size, setPageSize] = useState(10);


    // useEffect(() => {
    //     dispatch(getOrganisationList({session: session, filter: filter}))
    // }, [load_data === 'load_now'])


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


    function getOrganisations() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        for (const i in organisation_list) {
            if (i >= first && i < last) {
                paginated_list.push(organisation_list[i]);
            }
        }
        return paginated_list;
    }


    return (
        <div className="section px-5 pt-4">
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Organisation</td>
                        <td className="small text-black-50 px-4">Enabled</td>
                        <td>
                                <button onClick={() => handleAddOrganisation()} className={"btn btn-primary"}>+ Add New Organisation</button>
                        </td>
                    </tr>
                    </thead>
                    <tbody>

                    {organisation_list &&
                        getOrganisations().map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className="pt-3 px-4 pb-3" title={"organisation " + item.name}
                                        onClick={() => handleSelectOrganisation(session.id, item)}>
                                        {item.name}
                                    </td>
                                    <td className="pt-3 px-4 pb-3" title={item.enabled ? item.name + " is enabled" : item.name + " is disabled"}>
                                        {item.enabled ? "yes" : "no"}
                                    </td>
                                    <td>
                                        <button className={"btn btn-outline-primary"} title={"edit organisation " + item.name}
                                                onClick={() => handleEditOrganisation(item.id)}>Edit</button>
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