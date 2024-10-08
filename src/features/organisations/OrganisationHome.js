import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
     getOrganisationBackupList,
    getOrganisationList,
    showAddOrganisationForm, showBackupForm, showDeleteForm,
    showEditOrganisationForm, showOrganisationId
} from "./organisationSlice";
import {setSelectedKB, setSelectedOrganisation, simsageLogOut} from "../auth/authSlice";
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
import api, {IMAGES} from "../../common/api";
import {ShowInvalidSession} from "./ShowInvalidSession";
import {getGroupList} from "../groups/groupSlice";
import {useKeycloak} from "@react-keycloak/web";


export function OrganisationHome() {
    const { keycloak } = useKeycloak();
    const theme = null
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const load_data = useSelector((state) => state.organisationReducer.data_status)
    const backup_data_status = useSelector((state) => state.organisationReducer.backup_data_status)
    const user = useSelector((state) => state.authReducer.user);
    let busy = useSelector((state) => state.authReducer.busy);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const kb_list_loaded = useSelector((state) => state.kbReducer.kb_list_loaded);
    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);

    busy = busy | useSelector((state) => state.organisationReducer.organisation_busy);

    const selected_organisation_id = selected_organisation?selected_organisation.id:null;

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

    // const group_data_status = useSelector((state) => state.groupReducer.data_status)

    function  handleSignOut() {
        dispatch(simsageLogOut({session_id: session.id, keycloak}))
    }

    useEffect(() => {
        if (!session || !org_id || !session.id) return;
        dispatch(getOrganisationList({session: session, filter: filter}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === 'load_now'])

    useEffect(() => {
        if (!session || !org_id || !session.id) return;
        dispatch(getOrganisationBackupList({session: session, organisation_id: org_id}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backup_data_status === 'load_now', org_id != null])

    // load kbs?
    useEffect(() => {
        if (selected_organisation_id && selected_organisation_id.length > 0 &&
            session && session.id && !kb_list_loaded) {
            dispatch(getKBList({session_id: session.id, organization_id: selected_organisation_id}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_organisation_id, session, kb_list_loaded]);

    useEffect(() => {
        if (selected_knowledge_base_id === null && kb_list) {
            const p_kb = kb_list.find((kb) => kb.kbId === window.ENV.preferred_kb_id)
            if (p_kb && p_kb.kbId === window.ENV.preferred_kb_id) {
                dispatch(setSelectedKB(p_kb))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_knowledge_base_id, kb_list]);

    const handleRefresh = () => {
        if (!org_id) return;
        dispatch(getOrganisationList({session: session, filter: filter}))
        dispatch(getOrganisationBackupList({session: session, organisation_id: org_id}))
    }



    function handleSelectOrganisation(session_id, org) {
        if (!org) return;
        const org_id = org.id
        dispatch(setSelectedOrganisation(org));
        dispatch(getKBList({session_id: session.id, organization_id: org_id}));
        dispatch(getGroupList({session_id: session_id, organization_id: org_id, filter: null}))
        dispatch(selectTab('home'))
    }

    function handleViewOrganisationID(org_id) {
        if (!session || !org_id) return;
        dispatch(showOrganisationId({org_id: org_id}))
    }

    function handleAddOrganisation() {
        dispatch(showAddOrganisationForm({show_form: true}))
    }

    function handleEditOrganisation(org_id) {
        if (!session || !org_id) return;
        dispatch(showEditOrganisationForm({show_form: true, org_id: org_id}))
    }


    function handleRemoveOrganisation(org_id) {
        if (!session || !org_id) return;
        dispatch(showDeleteForm({org_id}))
    }


    function handleBackupOrganisation(org_id) {
        if (!session || !org_id) return;
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
        const val = event.target.value;
        dispatch(search({keyword: val}))
    }

    return (
        <div className="section px-5 pt-4">
            <div>
                <div className="d-flex justify-content-beteween w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="form-group me-2">
                            <input onKeyUp={(event) => handleSearchFilter(event)} type="text"
                                   placeholder={"Filter..."} className="form-control filter-search-input"/>
                        </div>
                    </div>
                    <div className="form-group d-flex ms-auto">
                        <div className="btn" onClick={() => handleRefresh()} >
                            <img src={IMAGES.REFRESH_IMAGE} className="refresh-image" alt="refresh" title="refresh organisations" />
                        </div>
                        <button data-testid="add-new-organisation"
                                disabled={busy}
                                onClick={() => setShowRestoreOrganisationForm(!show_restore_organisation_form)}
                                className="btn btn-outline-primary text-nowrap ms-2">Import
                        </button>

                        <button data-testid="add-new-organisation" onClick={() => handleAddOrganisation()}
                                disabled={busy}
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
                    <tr>
                        {getOrganisations().length === 0 &&
                            <td className={"pt-3 px-4 pb-3 fw-light"} colSpan={3}>No records found.</td>
                        }
                    </tr>

                    {organisation_list && selected_organisation &&
                        getOrganisations().map((item) => {
                            return (
                                <tr key={item.id} className={(item.id === selected_organisation.id) ? "active" : ""}>
                                    <td className={`${(item.id === selected_organisation.id) ? "fw-500" : ""} pt-3 px-4 pb-3`}
                                        title={"organisation " + item.name}
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
                                                    title={selected_organisation_id === item.id ? "cannot remove the organisation" : "remove organisation " + item.name}
                                                    disabled={selected_organisation_id === item.id}
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