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
    const [roleFilter, setRoleFilter] = useState('');
    const [availableRoleFilter, setAvailableRoleFilter] = useState('');
    const [availableGroupFilter, setAvailableGroupFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');

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
    const {register, handleSubmit,  formState: {errors}, reset} = useForm();

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

    // function getUserRoles(){
    //     if (!autoCreateSSORoleList || !autoCreateSSORoleList.length)
    //         return [];
    //     return roleFilter.length > 0 ? autoCreateSSORoleList.filter( role => {
    //             return Api.getPrettyRole(role.role).toLowerCase().includes(roleFilter.toLowerCase())
    //         })
    //         :
    //         autoCreateSSORoleList
    // }
    //
    // function addRoleToUser(roleToAdd){
    //     const list = (autoCreateSSORoleList && autoCreateSSORoleList.length > 0) ? autoCreateSSORoleList : [];
    //     list.push(roleToAdd);
    //     setAutoCreateSSORoleList(list);
    // }
    //
    // function removeRoleFromUser(roleToRemove){
    //     setAutoCreateSSORoleList(autoCreateSSORoleList.filter( r => {
    //         return r.role !== roleToRemove.role
    //     }))
    // }
    //
    // const getAvailableRoles = () => {
    //     const roleNames = autoCreateSSORoleList ? autoCreateSSORoleList.map( r => r.role) :  [];
    //     let tempRoleList = [];
    //     ["search", "dms", "discovery"].forEach( ar => {
    //         if(!roleNames.includes(ar)){
    //             tempRoleList.push(ar);
    //         }
    //     })
    //
    //     return availableRoleFilter.length > 0 ? tempRoleList.filter( role => {
    //             return Api.getPrettyRole(role).toLowerCase().includes(availableRoleFilter.toLowerCase())
    //         })
    //         :
    //         tempRoleList;
    // }
    //
    // function addGroupToUser(groupToAdd){
    //     setAutoCreateSSOACLList([...(autoCreateSSOACLList || []) , groupToAdd])
    // }
    //
    // function removeGroupFromUser(groupToRemove){
    //     setAutoCreateSSOACLList(autoCreateSSOACLList.filter( grp => {
    //         return grp.name !== groupToRemove.name
    //     }))
    // }
    //
    // const getAvailableGroups = () => {
    //     const groupNames = autoCreateSSOACLList ? autoCreateSSOACLList.map( g => g.name) : []
    //     const availableGroups = [].filter( grp => {
    //         return !groupNames.includes(grp.name)
    //     })
    //     return availableGroupFilter.length > 0 ? availableGroups.filter( grp => {
    //             return grp.name.toLowerCase().includes(availableGroupFilter.toLowerCase())
    //         })
    //         :
    //         availableGroups
    // }
    //
    // function getGroups(){
    //     return groupFilter.length > 0 ? autoCreateSSOACLList.filter( grp => {
    //             return grp.name.toLowerCase().includes(groupFilter.toLowerCase())
    //         })
    //         :
    //         autoCreateSSOACLList
    // }

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
                                    <OrganisationTab selected_tab={selected_tab} onTabChange={handleTabChange} />
                                </div>

                                {selected_tab === 'general' &&
                                <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px", minHeight: "400px"}}>
                                    <div className="mb-4">

                                        <div className={"mb-3 name" + (errors.name ? " error " : "")}>
                                            <label className="label-2 small">Name</label>
                                            <input className="form-control" {...register("name", {required: true})} />
                                            {errors.name && <span className="text-danger fst-italic small">This field is required </span>}
                                        </div>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" {...register('enabled')}/>
                                            <label className="form-check-label">Enabled</label>
                                        </div>

                                        <div>
                                            <input {...register("id")} type="hidden"/>
                                        </div>
                                    </div>
                                </div>
                                }

                                {selected_tab === 'sso' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px", minHeight: "400px"}}>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" {...register('autoCreateSSOUsers')}/>
                                            <label className="form-check-label">allow single sign-on users to be auto-created with a default set of group ACLs and SimSage role(s).</label>
                                        </div>

                                        <div className="form-group col-12">
                                            <label className="small">domain csv</label>
                                            <textarea className="form-control"
                                                      placeholder="valid domain names separated by commas (e.g. simsage.co.uk)"
                                                      rows="3"
                                                      {...register("autoCreateSSODomainList", {required: false})}
                                            />
                                        </div>

                                        {/*<div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "300px"}}>*/}
                                        {/*    <div className="row pb-5">*/}
                                        {/*        <div className="role-block col-6">*/}
                                        {/*            <h6 className="role-label text-center">SimSage Roles</h6>*/}
                                        {/*            <div className="role-area bg-light border rounded h-100">*/}
                                        {/*                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom" placeholder="Filter..." value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}/>*/}
                                        {/*                {*/}
                                        {/*                    getUserRoles().map((role, i) => {*/}
                                        {/*                        return (<Chip key={i} color="secondary"*/}
                                        {/*                                      onClick={() => removeRoleFromUser(role)}*/}
                                        {/*                                      label={Api.getPrettyRole(role.role)} variant="outlined"/>)*/}
                                        {/*                    })*/}
                                        {/*                }*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*        <div className="role-block col-6">*/}
                                        {/*            <h6 className="role-label text-center" >Available</h6>*/}
                                        {/*            <div className="role-area bg-light border rounded h-100">*/}
                                        {/*                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom" placeholder="Filter..." value={availableRoleFilter} onChange={(e) => setAvailableRoleFilter(e.target.value)}/>*/}
                                        {/*                {*/}
                                        {/*                    getAvailableRoles().map((role, i) => {*/}
                                        {/*                        return (<Chip key={i} color="primary"*/}
                                        {/*                                      onClick={() => addRoleToUser(role)}*/}
                                        {/*                                      label={Api.getPrettyRole(role)} variant="outlined"/>)*/}
                                        {/*                    })*/}
                                        {/*                }*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        {/*<div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "300px"}}>*/}
                                        {/*    <div className="row pb-5">*/}
                                        {/*        <div className="role-block col-6">*/}
                                        {/*            <h6 className="role-label text-center">SimSage Groups</h6>*/}
                                        {/*            <div className="role-area bg-light border rounded h-100">*/}
                                        {/*                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom" placeholder="Filter..." value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}/>*/}
                                        {/*                {*/}
                                        {/*                    autoCreateSSOACLList && getGroups().map((grp, i) => {*/}
                                        {/*                        return (*/}

                                        {/*                            <Chip key={i} color="secondary"*/}
                                        {/*                                  onClick={() => removeGroupFromUser(grp)}*/}
                                        {/*                                  label={grp.name} variant="outlined"/>*/}
                                        {/*                        )*/}
                                        {/*                    })*/}
                                        {/*                }*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*        <div className="role-block col-6">*/}
                                        {/*            <h6 className="role-label text-center">Available</h6>*/}
                                        {/*            <div className="role-area bg-light border rounded h-100">*/}
                                        {/*                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom" placeholder="Filter..." value={availableGroupFilter} onChange={(e) => setAvailableGroupFilter(e.target.value)}/>*/}
                                        {/*                {*/}
                                        {/*                    getAvailableGroups().map((grp, i) => {*/}
                                        {/*                        return (<Chip key={i} color="primary"*/}
                                        {/*                                      onClick={() => addGroupToUser(grp)}*/}
                                        {/*                                      label={grp.name}*/}
                                        {/*                                      variant="outlined"/>)*/}
                                        {/*                    })*/}
                                        {/*                }*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

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