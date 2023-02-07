import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    deleteOrganisation, getOrganisationBackupList,
    getOrganisationList,
    showAddOrganisationForm,
    showEditOrganisationForm
} from "./organisationSlice";
import {setSelectedKB, setSelectedOrganisation} from "../auth/authSlice";
import {Pagination} from "../../common/pagination";
import {selectTab} from "../home/homeSlice";
import {search, orderBy} from "./organisationSlice";
import {closeForm, getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import {showErrorAlert} from "../alerts/alertSlice";
import BkOrganisationBackupHome from "./BkOrganisationBackupHome";


export function OrganisationHome() {
    const theme = null
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const organisation_original_list = useSelector((state) => state.organisationReducer.organisation_original_list)
    const load_data = useSelector((state) => state.organisationReducer.data_status)
    const organisation_backup_list = useSelector((state) => state.organisationReducer.organisation_backup_list)

    const session = useSelector((state) => state.authReducer.session)
    const dispatch = useDispatch();

    const filter = null;

    //pagination
    const [page, setPage] = useState(0);
    const [page_size, setPageSize] = useState(10);


    //
    // function showBackupWarning(organisation_id) {
    //     if (!organisation_id) {
    //         dispatch(showErrorAlert({"message": "Organisation-id missing, please select an organisation first.", "title": "error"}));
    //         handleClose();
    //     }
    // }

    const handleClose = () => {
        dispatch(closeForm());
    }

    useEffect(() => {
        dispatch(getOrganisationList({session: session, filter: filter}))
    }, [load_data === 'load_now'])

    function loadBackupList(organisation_id){
        dispatch(getOrganisationBackupList({session: session, organisation_id: organisation_id}))
    }


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

    function handleViewOrganisationID(org_id) {
        console.log("handleViewOrganisationID")
        // dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    function handleRemoveOrganisation(org_id) {
        dispatch(deleteOrganisation({session_id: session.id, organisation_id: org_id}))
        console.log("handleRemoveOrganisation")
        // dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    function handleBackupOrganisation(org_id) {
        console.log("handleBackupOrganisation")
        // dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    function getOrganisations() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        const list = organisation_list;
        // const list = organisation_list != null ? organisation_list : organisation_original_list;
        for (const i in list) {
            if (i >= first && i < last) {
                paginated_list.push(organisation_list[i]);
            }
        }
        return paginated_list;
    }



    function handleSearchFilter(event){
        console.log("handleSearchFilter clicked")
        const val = event.target.value;
        dispatch(search({keyword: val}))
    }

    function handleOrderBy(event) {
        const val = event.target.value;
        console.log("handleOrderBy", val)
        dispatch(orderBy({order_by: val}))
    }


    return (
        <div className="section px-5 pt-4">
            <div>
                <div className="d-flex justify-content-beteween w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="form-group me-2">
                            <input onKeyUp={(event) => handleSearchFilter(event)} type="text"
                                   placeholder={"Filter..."} className="form-control"/>
                        </div>
                        <div className="form-group me-2">
                            <select placeholder={"Filter"} className="form-select filter-text-width" onChange={(e)=>handleOrderBy(e)}>
                                <option value="alphabetical">Alphabetical</option>
                                <option value="recently_added">Recently added</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group col ms-auto">
                        <button onClick={() => handleAddOrganisation()} className={"btn btn-primary"}>+ Add New
                        Organisation
                    </button>
                    </div>
                </div>
            </div>
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Organisation</td>
                        <td className="small text-black-50 px-4">Enabled</td>
                        <td>

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
                                    <td className="pt-3 px-4 pb-3"
                                        title={item.enabled ? item.name + " is enabled" : item.name + " is disabled"}>
                                        {item.enabled ? "yes" : "no"}
                                    </td>
                                    <td>
                                        <button className={"btn btn-outline-primary"}
                                                title={"view organisation id" + item.name}
                                                onClick={() => handleViewOrganisationID(item.id)}>View ID
                                        </button>

                                        <button className={"btn btn-outline-primary"}
                                                title={"edit organisation " + item.name}
                                                onClick={() => handleEditOrganisation(item.id)}>Edit
                                        </button>

                                        <button className={"btn btn-outline-primary"}
                                                title={"remove organisation " + item.name}
                                                onClick={() => handleRemoveOrganisation(item.id)}>Remove
                                        </button>

                                        <button className={"btn btn-outline-primary"}
                                                title={"backup organisation " + item.name}
                                                onClick={() => handleBackupOrganisation(item.id)}>Backup
                                        </button>
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

            {/*Show backups*/}
            <div>
                <BkOrganisationBackupHome/>
            </div>
        </div>);
}