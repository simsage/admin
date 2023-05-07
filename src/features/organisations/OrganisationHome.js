import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
     getOrganisationBackupList,
    getOrganisationList,
    showAddOrganisationForm, showBackupForm, showDeleteForm,
    showEditOrganisationForm, showOrganisationId
} from "./organisationSlice";
import { setSelectedOrganisation, simsageLogOut} from "../auth/authSlice";
import {Pagination} from "../../common/pagination";
import {selectTab} from "../home/homeSlice";
import {search} from "./organisationSlice";
import { getKBList} from "../knowledge_bases/knowledgeBaseSlice";
import BkOrganisationBackupHome from "./BkOrganisationBackupHome";
import BkOrganisationBackupDialog from "./BkOrganisationBackupDialog";
import BkOrganisationBackupProgressDialog from "./BkOrganisationBackupProgressDialog";
import BkOrganisationBackupDeleteDialog from "./BkOrganisationBackupDeleteDialog";
import BkOrganisationBackupDownloadDialog from "./BkOrganisationBackupDownloadDialog";
import {OrganisationViewId} from "./OrganisationViewId";
import OrganisationDeleteAsk from "./OrganisationDeleteAsk";
import OrganisationError from "./OrganisationError";
import BkOrganisationRestore from "./BkOrganisationRestore";
import {hasRole} from "../../common/helpers";
import api from "../../common/api";
import {ShowInvalidSession} from "./ShowInvalidSession";
import {useMsal} from "@azure/msal-react";


export function OrganisationHome() {
    const {instance} = useMsal();
    const theme = null
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const load_data = useSelector((state) => state.organisationReducer.data_status)
    const backup_data_status = useSelector((state) => state.organisationReducer.backup_data_status)
    const user = useSelector((state) => state.authReducer.user);

    //use one org id to load the backups
    const org_id = organisation_list[0] ? organisation_list[0].id : null;


    const session = useSelector((state) => state.authReducer.session)
    const dispatch = useDispatch();

    const filter = null;

    //pagination
    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const isAdmin = hasRole(user, ['admin']);
    //
    const [show_restore_organisation_form, setShowRestoreOrganisationForm] = useState(false);

    const error = useSelector((state) => state.organisationReducer.error);


    function  handleSignOut() {
        dispatch(simsageLogOut({session_id: session.id}))
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }


    // const handleClose = () => {
    //     dispatch(closeForm());
    // }

    useEffect(() => {
        dispatch(getOrganisationList({session: session, filter: filter}))
    }, [load_data === 'load_now'])

    useEffect(() => {
        dispatch(getOrganisationBackupList({session: session, organisation_id: org_id}))
    }, [backup_data_status === 'load_now', org_id != null])


    function handleSelectOrganisation(session_id, org) {
        const org_id = org.id
        dispatch(setSelectedOrganisation(org));
        dispatch(getKBList({session_id: session.id, organization_id: org_id}));
        dispatch(selectTab('home'))
    }

    function handleViewOrganisationID(org_id) {
        dispatch(showOrganisationId({org_id: org_id}))
    }

    function handleAddOrganisation() {
        dispatch(showAddOrganisationForm({show_form: true}))
    }

    function handleEditOrganisation(org_id) {
        dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    function handleRemoveOrganisation(org_id) {
        dispatch(showDeleteForm({org_id}))
    }


    function handleBackupOrganisation(org_id) {
        console.log("handleBackupOrganisation")
        dispatch(showBackupForm({show_form: true, org_id: org_id}))
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


    function handleSearchFilter(event) {
        console.log("handleSearchFilter clicked")
        const val = event.target.value;
        dispatch(search({keyword: val}))
    }

    // function handleOrderBy(event) {
    //     const val = event.target.value;
    //     console.log("handleOrderBy", val)
    //     dispatch(orderBy({order_by: val}))
    // }


    return (
        <div className="section px-5 pt-4">
            <div>
                <div className="d-flex justify-content-beteween w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="form-group me-2">
                            <input onKeyUp={(event) => handleSearchFilter(event)} type="text"
                                   placeholder={"Filter..."} className="form-control filter-search-input"/>
                        </div>
                        {/* <div className="form-group me-2">
                            <select placeholder={"Filter"} className="form-select filter-text-width" onChange={(e)=>handleOrderBy(e)}>
                                <option value="alphabetical">Alphabetical</option>
                                <option value="recently_added">Recently added</option>
                            </select>
                        </div> */}
                    </div>
                    <div className="form-group d-flex ms-auto">
                        <button data-testid="add-new-organisation"
                                onClick={() => setShowRestoreOrganisationForm(!show_restore_organisation_form)}
                                className="btn btn-outline-primary text-nowrap ms-2">Import
                        </button>

                        <button data-testid="add-new-organisation" onClick={() => handleAddOrganisation()}
                                className="btn btn-primary text-nowrap ms-2">+ Add
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
                                        <div className="d-flex  justify-content-end">
                                            <button className={"btn text-primary btn-sm"}
                                                    title={"view organisation id" + item.name}
                                                    onClick={() => handleViewOrganisationID(item.id)}>View ID
                                            </button>

                                            <button className={"btn text-primary btn-sm"}
                                                    title={"backup organisation " + item.name}
                                                    onClick={() => handleBackupOrganisation(item.id)}>Backup
                                            </button>

                                            <button className={"btn text-primary btn-sm"}
                                                    title={"edit organisation " + item.name}
                                                    onClick={() => handleEditOrganisation(item.id)}>Edit
                                            </button>

                                            <button className={"btn text-danger btn-sm"}
                                                    title={"remove organisation " + item.name}
                                                    onClick={() => handleRemoveOrganisation(item)}>Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {!organisation_list &&
                        <tr>
                            <td className="small text-black-50 px-4" colSpan={3}>No records found.</td>
                        </tr>
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
                <OrganisationViewId/>

                <OrganisationDeleteAsk/>

                <OrganisationError/>

                <BkOrganisationBackupHome/>

                <BkOrganisationBackupDialog/>

                <BkOrganisationBackupProgressDialog/>

                <BkOrganisationBackupDeleteDialog/>

                <BkOrganisationBackupDownloadDialog/>

                {isAdmin && show_restore_organisation_form &&
                    <BkOrganisationRestore
                        onClose={(val) => setShowRestoreOrganisationForm(val)}
                    />
                }


                {error === 'invalid session id' &&
                    <ShowInvalidSession
                        show_alert={true}
                        message={"Invalid session id"}
                        title={"Invalid session id"}
                        onClick={() => handleSignOut()}

                    />
                }

            </div>
        </div>);
}