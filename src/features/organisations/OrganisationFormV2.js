import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeOrganisationForm, deleteOrganisation, updateOrganisation} from "./organisationSlice";
import {useForm} from "react-hook-form";
import {OrganisationTab} from "./OrganisationFormTab";
import {Chip} from "../../components/Chip";
import {getGroupList} from "../groups/groupSlice";
import api, {Api} from "../../common/api";
import ACLSetup from "../../common/acl-setup";

export default function OrganisationFormV2(props) {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const selected_organisation_id = props.organisation_id;
    // const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)
    let organisation = props.organisation;

    const show_error_form = useSelector((state) => state.organisationReducer.show_error_form)
    const error_message = useSelector((state) => state.organisationReducer.error)

    const [selected_tab, setSelectedTab] = useState('general');
    const group_data_status = useSelector((state) => state.groupReducer.data_status);
    //group_list_full should be in ['Admin','Managers',..] format
    const roles_list_full = api.getPrettyRoles(useSelector((state) => state.usersReducer.roles));
    const sso_enabled = organisation ? organisation.autoCreateSSOUsers : false;

    //filters
    const [selected_role_filter, setRoleFilter] = useState('');
    const [available_role_filter, setAvailableRoleFilter] = useState('');

    const [selected_roles, setSelectedRoles] = useState(organisation ? api.getPrettyRoles(organisation.autoCreateSSORoleList) : []);
    const [selected_groups, setSelectedGroups] = useState(organisation ? Api.stringListToACLList(organisation.autoCreateSSOACLList) : []);

    const [show_enable_domain_error, setShowEnableDomainError] = useState(true);
    const [role_error, setRoleError] = useState(true);
    const isUserAdmin = useSelector((state) => state.authReducer.is_admin)


    const handleClose = () => {
        dispatch(closeOrganisationForm());
        setSelectedRoles([])
        setSelectedGroups([])
        setSelectedTab('general');
    }


    const handleDelete = () => {
        dispatch(deleteOrganisation({session_id: props.session.id, organisation_id: organisation.id}))
        handleClose();
    }

    // set title
    const title = (organisation === null) ? "New Organisation" : "Edit Organisation";

    //Form Hook
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        getValues,
        // watch,
    } = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = organisation ? organisation.name : '';
        defaultValues.enabled = organisation ? organisation.enabled : true;
        defaultValues.id = organisation ? organisation.id : undefined;
        defaultValues.autoCreateSSOUsers = organisation ? organisation.autoCreateSSOUsers : false;
        defaultValues.autoCreateSSODomainListStr = organisation ? organisation.autoCreateSSODomainList.toString() : "";
        defaultValues.autoCreateSSORoleList = organisation ? organisation.autoCreateSSORoleList : [];
        defaultValues.autoCreateSSOACLList = organisation ? organisation.autoCreateSSOACLList : [];

        reset({...defaultValues});
    }, [organisation, props.show_organisation_form, reset]);


    useEffect(() => {
        if (selected_organisation_id !== null && selected_organisation_id !== undefined) {
            dispatch(getGroupList({session_id: session.id, organization_id: selected_organisation_id, filter: null}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group_data_status === 'load_now', organisation])


    //Role validation
    useEffect(() => {
        if (selected_roles.length > 0 || !sso_enabled) {
            setRoleError(false)
        } else {
            setRoleError(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_roles, props.show_organisation_form, selected_organisation_id])

    //autoCreateSSODomainListStr validation
    useEffect(() => {
        let [x_enable, x_auto_create_SSO_domain_list_str] = getValues(['enabled', 'autoCreateSSODomainListStr'])
        if (x_enable && sso_enabled) {
            if (x_auto_create_SSO_domain_list_str.length < 4) {
                setShowEnableDomainError(true)
            } else {
                setShowEnableDomainError(false)
            }
        } else {
            setShowEnableDomainError(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getValues(['enabled'])])

    //on submit store or update
    const onSubmit = data => {
        if (show_enable_domain_error) {
            setSelectedTab('sso')
        } else if (selected_roles.length < 1 && sso_enabled) {
            setSelectedTab('sso')
        } else {
            data.autoCreateSSORoleList = selected_roles.map(role => {
                return role.role
            });
            data.autoCreateSSOACLList = selected_groups.map(acl => {
                return acl.acl
            })
            //convert domain string to array
            data.autoCreateSSODomainList = data.autoCreateSSODomainListStr.split(',');

            //form data
            const {autoCreateSSODomainListStr, ...form_data} = data;

            dispatch(updateOrganisation({session_id: props.session.id, data: form_data}))
            setSelectedRoles([])
            setSelectedGroups([])
            setSelectedTab('general');
        }

    };

    function handleTabChange(slug) {
        setSelectedTab(slug);
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // SimSage role management


    const getAvailableRoles = () => {
        const roleNames = selected_roles ? selected_roles.map(r => r.role) : [];
        let temp_available_rolls = roles_list_full.filter(role => {
            if (!roleNames.includes(role.role)) {
                return role
            } else {
                return false;
            }
        })

        return available_role_filter.length > 0 ? temp_available_rolls.filter(role => {
                return role.label.toLowerCase().includes(available_role_filter.toLowerCase())
            })
            :
            temp_available_rolls;

    }


    function getSelectedRoles() {
        return selected_role_filter.length > 0 ? selected_roles.filter(role => {
                return role.label.toLowerCase().includes(selected_role_filter.toLowerCase())
            })
            :
            selected_roles;

    }


    function addRoleToUser(role) {
        setSelectedRoles([...(selected_roles || []), role])
    }


    function removeRoleFromUser(role) {
        const temp_list = selected_roles.filter(r => {
            return r.role !== role.role
        })
        setSelectedRoles(temp_list)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!props.show_organisation_form)
        return (<div/>);

    return (
        <div>

            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-lg"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="modal-title" id="staticBackdropLabel">{title}</h4>
                            </div>
                            <div className="modal-body p-0">

                                <div className="nav nav-tabs overflow-auto">
                                    <OrganisationTab selected_tab={selected_tab} onTabChange={handleTabChange}/>
                                </div>

                                {selected_tab === 'general' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "300px"}}>
                                        <div className="row mb-4">

                                            <div className={"control-row col-10 name" + (errors.name ? " error " : "")}>
                                                <label className="label-2 small required">Name</label>
                                                <div className="d-flex align-items-center">
                                                    <input
                                                        className="form-control me-3" {...register("name", {required: true})} />
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input"
                                                               type="checkbox" {...register('enabled')}/>
                                                        <label className="form-check-label">Enabled</label>
                                                    </div>
                                                    <div>
                                                        <input {...register("id")} type="hidden"/>
                                                    </div>
                                                </div>
                                                {errors.name &&
                                                    <span
                                                        className="text-danger fst-italic small">This field is required </span>}
                                                {show_error_form &&
                                                    <span
                                                        className="text-danger fst-italic small"> {error_message} </span>}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selected_tab === 'sso' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input"
                                                           type="checkbox" {...register('autoCreateSSOUsers')}
                                                    />
                                                    <label className="form-check-label">Allow single
                                                        sign-on users to be
                                                        auto-created with a default set of group ACLs
                                                        and SimSage
                                                        role(s).</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mb-5">
                                            <div className="form-group col-12">
                                                <label className="label-2 small">Domain CSV <span
                                                    className="small text-black-50 fst-italic fw-light">(Separate by comma) </span>
                                                </label>
                                                <textarea className="form-control"
                                                          placeholder="Valid domain names (e.g. simsage.co.uk)"
                                                          rows="3"
                                                          {...register("autoCreateSSODomainListStr", {required: getValues('autoCreateSSOUsers')})}
                                                />
                                            </div>
                                            {(errors.autoCreateSSODomainListStr || show_enable_domain_error) &&
                                                <span
                                                    className="text-danger fst-italic small">This field is required </span>}
                                        </div>

                                        <div>
                                            <div className="row pb-5 mb-3">
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">SSO assigned
                                                        Roles</h6>
                                                    <div
                                                        className="role-area bg-light border rounded h-100">
                                                        <input
                                                            className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                            placeholder="Filter..."
                                                            value={selected_role_filter}
                                                            onChange={(e) => setRoleFilter(e.target.value)}/>
                                                        {
                                                            getSelectedRoles().map((role, i) => {
                                                                return (<Chip key={i} color="secondary"
                                                                              onClick={() => removeRoleFromUser(role)}
                                                                              label={role.label}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>

                                                    {(role_error) &&
                                                        <span
                                                            className="text-danger fst-italic small">This field is required </span>}

                                                </div>
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">Available Roles</h6>
                                                    <div
                                                        className="role-area bg-light border rounded h-100">
                                                        <input
                                                            className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                            placeholder="Filter..."
                                                            value={available_role_filter}
                                                            onChange={(e) => setAvailableRoleFilter(e.target.value)}/>
                                                        {
                                                            getAvailableRoles().map((role, i) => {
                                                                return (<Chip key={i} color="primary"
                                                                              onClick={() => addRoleToUser(role)}
                                                                              label={role.label}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {organisation &&
                                            <div>
                                                <ACLSetup
                                                    left_title={"SSO assigned ACLs"}
                                                    right_title={"Available ACLs"}
                                                    select_acl_crud={false}
                                                    active_acl_list={selected_groups}
                                                    on_update={(ACLs) => setSelectedGroups(ACLs)}
                                                    organisation_id={organisation.id}
                                                    page_size={5}
                                                />
                                            </div>
                                        }
                                    </div>
                                }

                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <button onClick={handleClose} type="button"
                                        className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>

                                {organisation !== null && isUserAdmin &&
                                    <button onClick={handleDelete} type="button"
                                            className="btn btn-danger px-4">Delete</button>
                                }
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}