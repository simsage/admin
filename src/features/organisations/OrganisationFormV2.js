import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeOrganisationForm, deleteOrganisation, updateOrganisation} from "./organisationSlice";
import {useForm} from "react-hook-form";
import {OrganisationTab} from "./OrganisationFormTab";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";

export default function OrganisationFormV2(props) {

    const dispatch = useDispatch();
    let organisation = null;
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);

    const [selected_tab, setSelectedTab] = useState('general')

    //filters
    const [selected_role_filter, setRoleFilter] = useState('');
    const [available_role_filter, setAvailableRoleFilter] = useState('');
    const [available_group_filter, setAvailableGroupFilter] = useState('');
    const [selected_group_filter, setSelectedGroupFilter] = useState('');

    const [selected_roles, setSelectedRoles] = useState([]);
    const [selected_groups, setSelectedGroups] = useState([]);

    const available_roles = ["search", "dms", "discovery"];
    const available_groups = ["group1", "group2", "group3"];

    //load organisation
    if (props.organisation_id && organisation_list) {
        let temp_org = organisation_list.filter((org) => {
            return org.id === props.organisation_id
        })
        if (temp_org.length > 0) {
            organisation = (temp_org[0])
        }
    }

    const handleClose = () => {
        dispatch(closeOrganisationForm());
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
        watch,
        getValues
    } = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = organisation ? organisation.name : '';
        defaultValues.enabled = organisation ? organisation.enabled : false;
        defaultValues.id = organisation ? organisation.id : undefined;
        defaultValues.autoCreateSSOUsers = organisation ? organisation.autoCreateSSOUsers : false;
        defaultValues.autoCreateSSODomainList = organisation ? organisation.autoCreateSSODomainList : "";
        defaultValues.autoCreateSSORoleList = organisation ? organisation.autoCreateSSORoleList : [];
        defaultValues.autoCreateSSOACLList = organisation ? organisation.autoCreateSSOACLList : [];
        reset({...defaultValues});
    }, [organisation, props.show_organisation_form, reset]);


    //on submit store or update
    const onSubmit = data => {
        dispatch(updateOrganisation({session_id: props.session.id, data: data}))
    };

    function handleTabChange(slug) {
        setSelectedTab(slug);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // SimSage role management


    function getUserRoles() {
        let temp_list = [];
        if(selected_role_filter.length > 0) {
            temp_list = selected_roles.filter((role) => {
                return Api.getPrettyRole(role).toLowerCase().includes(selected_role_filter.toLowerCase())
            })
        } else {
          temp_list = selected_roles
        }
        return temp_list;
    }


    function addRoleToUser(roleToAdd){
        setSelectedRoles([ ...(selected_roles || []), roleToAdd ])
    };



    function removeRoleFromUser(role) {
        const temp_list = selected_roles.filter( r => {
            return r !== role
        })
        setSelectedRoles(temp_list)
    }

    const getAvailableRoles = () => {
        let temp_role_list = []
        available_roles.forEach((role)=>{
            if(!selected_roles.includes(role)) {
                temp_role_list.push(role)
            }
        })

        return available_role_filter.length > 0 ? temp_role_list.filter(role => {
                return Api.getPrettyRole(role).toLowerCase().includes(available_role_filter.toLowerCase())
            })
            :
            temp_role_list;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // group/ACL management

    function addGroupToUser(group) {
        setSelectedGroups([ ...(selected_groups || []), group ])
        // setAutoCreateSSOACLList([...(autoCreateSSOACLList || []) , groupToAdd])
    }

    function removeGroupFromUser(group) {

        const temp_list = selected_groups.filter( g => {
            return g !== group
        })
        setSelectedGroups(temp_list)

    }

    const getAvailableGroups = () => {

        let temp_list = []
        available_groups.forEach((group)=>{
            if(!selected_groups.includes(group)) {
                temp_list.push(group)
            }
        })

        return available_group_filter.length > 0 ? temp_list.filter(group => {
                return group.toLowerCase().includes(available_group_filter.toLowerCase())
            })
            :
            temp_list;

    }

    function getGroups() {
        let temp_list = [];
        if(selected_group_filter.length > 0) {
            temp_list = selected_groups.filter((group) => {
                return Api.getPrettyRole(group).toLowerCase().includes(selected_group_filter.toLowerCase())
            })
        } else {
            temp_list = selected_groups
        }
        return temp_list;
    }


    // React.useEffect(() => {
    //     console.log("")
    // }, [watch, getValues]);

    console.log("getValues", getValues())
    // console.log("getRoelse", getUserRoles())
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!props.show_organisation_form)
        return (<div/>);

    return (
        <div>

            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="modal-title" id="staticBackdropLabel">{title}</h4>
                                {/* <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body p-0">

                                <div className="nav nav-tabs overflow-auto">
                                    <OrganisationTab selected_tab={selected_tab} onTabChange={handleTabChange}/>
                                </div>

                                {selected_tab === 'general' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="mb-4">

                                            <div className={"mb-3 name" + (errors.name ? " error " : "")}>
                                                <label className="label-2 small">Name</label>
                                                <input
                                                    className="form-control" {...register("name", {required: true})} />
                                                {errors.name &&
                                                    <span className="text-danger fst-italic small">This field is required </span>}
                                            </div>

                                            <div className="form-check form-switch">
                                                <input className="form-check-input"
                                                       type="checkbox" {...register('enabled')}/>
                                                <label className="form-check-label">Enabled</label>
                                            </div>

                                            <div>
                                                <input {...register("id")} type="hidden"/>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selected_tab === 'sso' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('autoCreateSSOUsers')}/>
                                            <label className="form-check-label">allow single sign-on users to be
                                                auto-created with a default set of group ACLs and SimSage
                                                role(s).</label>
                                        </div>

                                        <div className="form-group col-12">
                                            <label className="small">domain csv</label>
                                            <textarea className="form-control"
                                                      placeholder="valid domain names separated by commas (e.g. simsage.co.uk)"
                                                      rows="3"
                                                      {...register("autoCreateSSODomainList", {required: false})}
                                            />
                                        </div>

                                        <div className="tab-content container px-5 py-4 overflow-auto"
                                             style={{maxHeight: "450px"}}>
                                            <div className="row pb-5">
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">SimSage Roles</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={selected_role_filter}
                                                               onChange={(e) => setRoleFilter(e.target.value)}/>
                                                        {
                                                            getUserRoles().map((role, i) => {
                                                                return (<Chip key={i} color="secondary"
                                                                              onClick={() => removeRoleFromUser(role)}
                                                                              label={Api.getPrettyRole(role)}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">Available</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={available_role_filter}
                                                               onChange={(e) => setAvailableRoleFilter(e.target.value)}/>
                                                        {
                                                            getAvailableRoles().map((role, i) => {
                                                                return (<Chip key={i} color="primary"
                                                                              onClick={() => addRoleToUser(role)}
                                                                              label={Api.getPrettyRole(role)}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-content container px-5 py-4 overflow-auto"
                                             style={{maxHeight: "300px"}}>
                                            <div className="row pb-5">
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">SimSage Groups</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={selected_group_filter}
                                                               onChange={(e) => setSelectedGroupFilter(e.target.value)}/>
                                                        {
                                                            getGroups().map((grp, i) => {
                                                                return (

                                                                    <Chip key={i} color="secondary"
                                                                          onClick={() => removeGroupFromUser(grp)}
                                                                          label={grp} variant="outlined"/>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">Available</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={available_group_filter}
                                                               onChange={(e) => setAvailableGroupFilter(e.target.value)}/>
                                                        {
                                                            getAvailableGroups().map((grp, i) => {
                                                                return (<Chip key={i} color="primary"
                                                                              onClick={() => addGroupToUser(grp)}
                                                                              label={grp}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                }

                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>

                                {organisation !== null &&
                                    <button onClick={handleDelete} type="button"
                                            className="btn btn-danger px-4">Delete</button>
                                }
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );

}